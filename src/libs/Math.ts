import { create, all, MathNode } from 'mathjs'
import { Constants } from '../pages/ConstantDefinitions'
import { isNumeric } from './Misc'
import format from 'string-format'

const math = create(all, {})

export const mathParse = (exp: string): MathNode => {
    if (math.parse) {
        return math.parse(exp)
    } else {
        throw new Error('Failed to initialize math.js. Was the library properly installed?')
    }
}

export const replaceNodeInExpression = (expression: MathNode, nodeToReplace: string, replaceWithExp: string): MathNode => {
    return expression.transform((node: MathNode) => {
        if (node.isSymbolNode && node.name === nodeToReplace) {
            return mathParse(replaceWithExp)
        }
        return node
    })
}

export const getNodeNamesInExpression = (expression: MathNode): string[] => {
    const nodeNames: Array<string> = []
    const functionsUsed: Set<string> = new Set()
    expression.traverse((node: MathNode) => {
        if (node.isFunctionNode && node.name) {
            functionsUsed.add(node.name)
        } else if (node.isSymbolNode && node.name && !functionsUsed.has(node.name)) {
            nodeNames.push(node.name)
        }
    })
    return nodeNames
}

export const formatMoney = (money?: number | null): string | undefined => {
    return money?.toLocaleString(Constants.CURRENCY_LANGUAGE, Constants.CURRENCY_SETTINGS)
}

export const checkValidVarName = (str: string): boolean => {
    return !isNumeric(str) && !str.includes(".")
}

export const getNearestMultiple = (num: number, mult: number): number => {
    return Math.round(num / mult) * mult
}

export const getValueDisplayString = (num: number | null | undefined, fmt: string | undefined): string => {
    if (num == null || num == undefined) return '(Null)'
    const stringVal = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (!fmt) return stringVal
    return format(fmt, stringVal)
}
