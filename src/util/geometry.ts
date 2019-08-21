import { Point, Rectangle } from '../struct'
import { getValue } from './object'
import { Direction } from '../types'

export function toRadians(deg: number) {
  return Math.PI * deg / 180
}

export function toDegree(rad: number) {
  return rad * 180 / Math.PI
}

export function getBoundingBox(rect: Rectangle, rotation: number, cx?: Point) {
  if (rect != null && rotation != null && rotation !== 0) {
    const rad = toRadians(rotation)
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    cx = (cx != null) // tslint:disable-line
      ? cx
      : new Point(rect.x + rect.width / 2, rect.y + rect.height / 2)

    let p1 = new Point(rect.x, rect.y)
    let p2 = new Point(rect.x + rect.width, rect.y)
    let p3 = new Point(p2.x, rect.y + rect.height)
    let p4 = new Point(rect.x, p3.y)

    p1 = rotatePoint(p1, cos, sin, cx)
    p2 = rotatePoint(p2, cos, sin, cx)
    p3 = rotatePoint(p3, cos, sin, cx)
    p4 = rotatePoint(p4, cos, sin, cx)

    const result = new Rectangle(p1.x, p1.y, 0, 0)
    result.add(new Rectangle(p2.x, p2.y, 0, 0))
    result.add(new Rectangle(p3.x, p3.y, 0, 0))
    result.add(new Rectangle(p4.x, p4.y, 0, 0))

    return result
  }

  return rect
}

export function rotatePoint(
  point: Point | Point.PointLike,
  cos: number,
  sin: number,
  center?: Point,
) {
  const c = center == null ? new Point() : center
  const dx = point.x - c.x
  const dy = point.y - c.y
  const x1 = dx * cos - dy * sin
  const y1 = dy * cos + dx * sin

  return new Point(x1 + c.x, y1 + c.y)
}

/**
 * Converts the given arc to a series of curves.
 */
export function arcToCurves(
  x0: number, y0: number,
  r1: number, r2: number,
  angle: number,
  largeArcFlag: number, sweepFlag: number,
  x: number, y: number,
) {
  if (r1 === 0 || r2 === 0) {
    return []
  }

  x -= x0 // tslint:disable-line:no-parameter-reassignment
  y -= y0 // tslint:disable-line:no-parameter-reassignment
  r1 = Math.abs(r1) // tslint:disable-line:no-parameter-reassignment
  r2 = Math.abs(r2) // tslint:disable-line:no-parameter-reassignment

  const fS = sweepFlag
  const psai = angle
  const ctx = -x / 2
  const cty = -y / 2
  const cpsi = Math.cos(psai * Math.PI / 180)
  const spsi = Math.sin(psai * Math.PI / 180)
  const rxd = cpsi * ctx + spsi * cty
  const ryd = -1 * spsi * ctx + cpsi * cty
  const rxdd = rxd * rxd
  const rydd = ryd * ryd
  const r1x = r1 * r1
  const r2y = r2 * r2
  const lamda = rxdd / r1x + rydd / r2y

  let sds

  if (lamda > 1) {
    r1 = Math.sqrt(lamda) * r1 // tslint:disable-line:no-parameter-reassignment
    r2 = Math.sqrt(lamda) * r2 // tslint:disable-line:no-parameter-reassignment
    sds = 0
  } else {
    let seif = 1
    if (largeArcFlag === fS) {
      seif = -1
    }

    sds = seif * Math.sqrt(
      (r1x * r2y - r1x * rydd - r2y * rxdd) / (r1x * rydd + r2y * rxdd),
    )
  }

  const txd = sds * r1 * ryd / r2
  const tyd = -1 * sds * r2 * rxd / r1
  const tx = cpsi * txd - spsi * tyd + x / 2
  const ty = spsi * txd + cpsi * tyd + y / 2

  let rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1) - Math.atan2(0, 1)
  let s1 = (rad >= 0) ? rad : 2 * Math.PI + rad
  rad = (
    Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1) -
    Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1)
  )
  let dr = (rad >= 0) ? rad : 2 * Math.PI + rad

  if (fS === 0 && dr > 0) {
    dr -= 2 * Math.PI
  } else if (fS !== 0 && dr < 0) {
    dr += 2 * Math.PI
  }

  const sse = dr * 2 / Math.PI
  const seg = Math.ceil(sse < 0 ? -1 * sse : sse)
  const segr = dr / seg
  const t = 8 / 3 * Math.sin(segr / 4) * Math.sin(segr / 4) / Math.sin(segr / 2)
  const cpsir1 = cpsi * r1
  const cpsir2 = cpsi * r2
  const spsir1 = spsi * r1
  const spsir2 = spsi * r2

  let mc = Math.cos(s1)
  let ms = Math.sin(s1)
  let x2 = -t * (cpsir1 * ms + spsir2 * mc)
  let y2 = -t * (spsir1 * ms - cpsir2 * mc)
  let x3 = 0
  let y3 = 0

  const result = []

  for (let n = 0; n < seg; n += 1) {
    s1 += segr
    mc = Math.cos(s1)
    ms = Math.sin(s1)

    x3 = cpsir1 * mc - spsir2 * ms + tx
    y3 = spsir1 * mc + cpsir2 * ms + ty
    const dx = -t * (cpsir1 * ms + spsir2 * mc)
    const dy = -t * (spsir1 * ms - cpsir2 * mc)

    // CurveTo updates x0, y0 so need to restore it
    const index = n * 6
    result[index] = Number(x2 + x0)
    result[index + 1] = Number(y2 + y0)
    result[index + 2] = Number(x3 - dx + x0)
    result[index + 3] = Number(y3 - dy + y0)
    result[index + 4] = Number(x3 + x0)
    result[index + 5] = Number(y3 + y0)

    x2 = x3 + dx
    y2 = y3 + dy
  }

  return result
}

export function equalPoints(a: Point[], b: Point[]) {
  if (
    (a == null && b != null) ||
    (a != null && b == null) ||
    (a != null && b != null && a.length !== b.length)) {
    return false
  }

  if (a != null && b != null) {
    for (let i = 0, ii = a.length; i < ii; i += 1) {
      if (
        a[i] === b[i] ||
        (a[i] != null && !a[i].equals(b[i]))
      ) {
        return false
      }
    }
  }

  return true
}

/**
 * Adds the given margins to the given rectangle and rotates and flips the
 * rectangle according to the respective styles in style.
 */
export function getDirectedBounds(
  rect: Rectangle,
  m: Rectangle,
  style: any,
  flipH: boolean,
  flipV: boolean,
) {
  const d = getValue(style, 'direction', Direction.east) as Direction
  // tslint:disable-next-line:no-parameter-reassignment
  flipH = (flipH != null) ? flipH : getValue(style, 'flipH', false) as boolean
  // tslint:disable-next-line:no-parameter-reassignment
  flipV = (flipV != null) ? flipV : getValue(style, 'flipV', false) as boolean

  m.x = Math.round(Math.max(0, Math.min(rect.width, m.x)))
  m.y = Math.round(Math.max(0, Math.min(rect.height, m.y)))
  m.width = Math.round(Math.max(0, Math.min(rect.width, m.width)))
  m.height = Math.round(Math.max(0, Math.min(rect.height, m.height)))

  if (
    (flipV && (d === Direction.south || d === Direction.north)) ||
    (flipH && (d === Direction.east || d === Direction.west))
  ) {
    const tmp = m.x
    m.x = m.width
    m.width = tmp
  }

  if (
    (flipH && (d === Direction.south || d === Direction.north)) ||
    (flipV && (d === Direction.east || d === Direction.west))
  ) {
    const tmp = m.y
    m.y = m.height
    m.height = tmp
  }

  const m2 = Rectangle.clone(m)
  if (d === Direction.south) {
    m2.y = m.x
    m2.x = m.height
    m2.width = m.y
    m2.height = m.width
  } else if (d === Direction.west) {
    m2.y = m.height
    m2.x = m.width
    m2.width = m.x
    m2.height = m.y
  } else if (d === Direction.north) {
    m2.y = m.width
    m2.x = m.y
    m2.width = m.height
    m2.height = m.x
  }

  return new Rectangle(
    rect.x + m2.x,
    rect.y + m2.y,
    rect.width - m2.width - m2.x,
    rect.height - m2.height - m2.y,
  )
}

/**
* Returns the intersection of two lines as an `Point`.
*/
export function intersection(
  x0: number, y0: number, x1: number, y1: number, // first line
  x2: number, y2: number, x3: number, y3: number, // second line
) {
  const d = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0))
  const a = ((x3 - x2) * (y0 - y2)) - ((y3 - y2) * (x0 - x2))
  const b = ((x1 - x0) * (y0 - y2)) - ((y1 - y0) * (x0 - x2))

  const ua = a / d
  const ub = b / d

  if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
    // Get the intersection point
    const x = x0 + ua * (x1 - x0)
    const y = y0 + ua * (y1 - y0)

    return new Point(x, y)
  }

  // No intersection
  return null
}

/**
 * Returns 1 if the given point on the right side of the segment, 0 if its
 * on the segment, and -1 if the point is on the left side of the segment.
 *
 * @param x1 X-coordinate of the startpoint of the segment.
 * @param y1 Y-coordinate of the startpoint of the segment.
 * @param x2 X-coordinate of the endpoint of the segment.
 * @param y2 Y-coordinate of the endpoint of the segment.
 * @param px X-coordinate of the point.
 * @param py Y-coordinate of the point.
 */
export function relativeCcw(
  x1: number, y1: number,
  x2: number, y2: number,
  px: number, py: number,
) {
  x2 -= x1 // tslint:disable-line
  y2 -= y1 // tslint:disable-line
  px -= x1 // tslint:disable-line
  py -= y1 // tslint:disable-line
  let ccw = px * y2 - py * x2

  if (ccw === 0.0) {
    ccw = px * x2 + py * y2

    if (ccw > 0.0) {
      px -= x2 // tslint:disable-line
      py -= y2 // tslint:disable-line
      ccw = px * x2 + py * y2

      if (ccw < 0.0) {
        ccw = 0.0
      }
    }
  }

  return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0)
}
