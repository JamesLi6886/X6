const ua = navigator.userAgent

export namespace detector {
  /**
	 * True if the client is a Windows.
	 */
  export const IS_WINDOWS = navigator.appVersion.indexOf('Win') > 0

  /**
	 * True if the client is a Mac.
	 */
  export const IS_MAC = navigator.appVersion.indexOf('Mac') > 0

  /**
	 * True if the client is a Chrome OS.
	 */
  export const IS_CHROMEOS = /\bCrOS\b/.test(ua)

  /**
	 * True if the user agent is an iPad, iPhone or iPod.
	 */
  export const IS_IOS = (ua.match(/(iPad|iPhone|iPod)/g) ? true : false)

  export const IS_IE = ua.indexOf('MSIE') >= 0
  export const IS_IE6 = ua.indexOf('MSIE 6') >= 0
  export const IS_IE11 = !!ua.match(/Trident\/7\./)
  export const IS_EDGE = !!ua.match(/Edge\//)

  /**
   * True if the current browser is Internet Explorer and it is in quirks mode.
   */
  export const IS_QUIRKS = (
    ua.indexOf('MSIE') >= 0 &&
    (
      (document as any).documentMode == null ||
      (document as any).documentMode === 5
    )
  )

  /**
   * True if the browser is IE11 in enterprise mode (IE8 standards mode).
   */
  export const IS_EM = (
    'spellcheck' in document.createElement('textarea') &&
    (document as any).documentMode === 8
  )

  /**
   * True if the current browser is Netscape (including Firefox).
   */
  export const IS_NETSCAPE = (
    ua.indexOf('Mozilla/') >= 0 &&
    ua.indexOf('MSIE') < 0 &&
    ua.indexOf('Edge/') < 0
  )

  /**
	 * True if the current browser is Opera.
	 */
  export const IS_OPERA = (
    ua.indexOf('Opera/') >= 0 ||
    ua.indexOf('OPR/') >= 0
  )

  /**
	 * True if the current browser is Safari.
	 */
  export const IS_SAFARI = (
    ua.indexOf('AppleWebKit/') >= 0 &&
    ua.indexOf('Chrome/') < 0 &&
    ua.indexOf('Edge/') < 0
  )

  /**
	 * True if the current browser is Google Chrome.
	 */
  export const IS_CHROME = (
    ua.indexOf('Chrome/') >= 0 &&
    ua.indexOf('Edge/') < 0
  )

  /**
	 * True if the this is running inside a Chrome App.
	 */
  export const IS_CHROME_APP = (
    (window as any).chrome != null &&
    (window as any).chrome.app != null &&
    (window as any).chrome.app.runtime != null
  )

  /**
	 * True if the current browser is Firefox.
	 */
  export const IS_FIREFOX = ua.indexOf('Firefox/') >= 0

  /**
	 * True if -moz-transform is available as a CSS style. This is the case
	 * for all Firefox-based browsers newer than or equal 3, such as Camino,
	 * Iceweasel, Seamonkey and Iceape.
	 */
  export const IS_MT = (
    (
      ua.indexOf('Firefox/') >= 0 &&
      ua.indexOf('Firefox/1.') < 0 &&
      ua.indexOf('Firefox/2.') < 0
    ) ||
    (
      ua.indexOf('Iceweasel/') >= 0 &&
      ua.indexOf('Iceweasel/1.') < 0 &&
      ua.indexOf('Iceweasel/2.') < 0
    ) ||
    (
      ua.indexOf('SeaMonkey/') >= 0 &&
      ua.indexOf('SeaMonkey/1.') < 0
    ) ||
    (
      ua.indexOf('Iceape/') >= 0 &&
      ua.indexOf('Iceape/1.') < 0
    )
  )

  /**
	 * True if -o-transform is available as a CSS style, ie for Opera
   * browsers based on a Presto engine with version 2.5 or later.
	 */
  export const IS_OT = (
    ua.indexOf('Presto/') >= 0 &&
    ua.indexOf('Presto/2.4.') < 0 &&
    ua.indexOf('Presto/2.3.') < 0 &&
    ua.indexOf('Presto/2.2.') < 0 &&
    ua.indexOf('Presto/2.1.') < 0 &&
    ua.indexOf('Presto/2.0.') < 0 &&
    ua.indexOf('Presto/1.') < 0
  )

  /**
	 * True if this device supports touchstart/-move/-end events (Apple iOS,
	 * Android, Chromebook and Chrome Browser on touch-enabled devices).
	 */
  export const SUPPORT_TOUCH = 'ontouchstart' in document.documentElement

  /**
	 * True if this device supports Microsoft pointer events.
	 */
  export const SUPPORT_POINTER = (
    (window as any).PointerEvent != null &&
    !IS_MAC
  )

  /**
   * True if foreignObject support is not available. This is the case for
   * Opera, older SVG-based browsers and all versions of IE.
   */
  export const NO_FOREIGNOBJECT = (
    !document.createElementNS ||
    `${document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    )}` !== '[object SVGForeignObjectElement]' ||
    ua.indexOf('Opera/') >= 0
  )

  const href = document.location.href
  /**
	 * True if the documents location does not start with http:// or https://.
	 */
  export const IS_LOCAL = (
    href.indexOf('http://') < 0 &&
    href.indexOf('https://') < 0
  )
}
