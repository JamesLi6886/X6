import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class VisibleChange implements IChange {
  private previous: boolean

  constructor(
    private readonly model: Model,
    private cell: Cell,
    private visible: boolean,
  ) {
    this.previous = visible
  }

  execute() {
    if (this.cell != null) {
      this.visible = this.previous
      this.previous = this.model.doVisibleChange(this.cell, this.previous)
    }
  }
}
