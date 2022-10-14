import { MathNode } from 'mathjs'
import { mathParse } from './Math'


class Node {
  key: string
  expression: MathNode
  adjacents: Node[]
  comment: string
  description: string
  parent: Node | null
  values: Record<string, unknown>
  units: string | undefined

  constructor(
    key: string,
    expression: string,
    units: string | undefined,
    values = {},
    comment = '',
    description = ''
  ) {
    this.key = key
    this.expression = mathParse(expression)
    this.adjacents = []
    this.values = values
    this.comment = comment
    this.description = description
    this.parent = null
    this.units = units
  }
}

export default Node
