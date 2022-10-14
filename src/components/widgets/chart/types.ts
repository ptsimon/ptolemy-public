import { MouseEvent } from 'react'

export type Elements = Array<Element | Edge>

export type Position = {
    x: number,
    y: number,
}

export type Element = {
    id: string,
    type: string,
    data: NodeData,
    position: Position
}

export type Edge = {
    id: string,
    source: string,
    target: string,
}

export type NodeData = {
    label: string,
    cost: number | null,
    callbacks: NodeCallbacks,
    id: string,
    parentId?: string,
    numChildren: number,
    isCollapsed: boolean,
    units?: string,
}

export type NodeCallbacks = {
    onNodeClick: (e: MouseEvent, node: NodeData) => void,
}
