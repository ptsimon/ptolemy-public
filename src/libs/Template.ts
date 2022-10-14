import clone from "just-clone"
import { Assumptions, Skeleton, SkeletonNode } from "../core/types"
import { UnexpectedError } from "./Misc"
import * as Skl from './Skeleton'

type Base = {
    id: string,
    title: string,
    keywords: string[],
    nodes: Skeleton,
    authors: string[],
    shortInfo: string,
}

export type Template = Base & {
    isNamed: false
}

export type NamedTemplate = Base & {
    isNamed: true,
    subtreeRoot: SkeletonNode,
    newAssumptions: Assumptions,
    namespace: string[],
}

export const getRoot = (template: Template | NamedTemplate | undefined): SkeletonNode | undefined => {
    if (!template) return
    return Skl.getRootNode(template.nodes)
}

export const createNamedTemplate = (template: Template, name: string, parentNodeId: string): NamedTemplate => {
    let newSkeleton: Skeleton = clone(template.nodes)
    const assumptions: Assumptions = Skl.getAssumptions(newSkeleton)

    // TODO refactor, more specifically detach the assumptions from the subtree skeleton to avoid workarounds and general confusion

    // Rename skeleton nodes
    const nodeIds: string[] = newSkeleton.map(n => n.id)
    nodeIds.forEach(nodeId => {
        const newNodeName = Skl.isRootNode(nodeId) ? name : `${name}_${nodeId}`
        newSkeleton = Skl.renameNodeInSkeleton(newSkeleton, nodeId, newNodeName, assumptions)
    })

    // Rename assumptions
    Object.keys(assumptions).forEach(assumption => {
        newSkeleton = Skl.renameAssumptionInSkeleton(newSkeleton, assumption, `${name}_${assumption}`, name)
    })

    // Find new root and set its parent 
    const newRoot = Skl.findIdInSkeleton(newSkeleton, name)
    if (!newRoot) throw new UnexpectedError("No root found in template. Is the root node (usually 'TCO') present in the template?")
    newRoot.parent = parentNodeId

    // Create namespace before detaching assumptions
    const namespace = Skl.getNamespace(newSkeleton, newRoot)

    // Detach assumptions
    const newAssumptions = newRoot.assumptions ?? {}
    delete newRoot["assumptions"]
    
    // Create named template
    return {
        ...template,
        isNamed: true,
        nodes: newSkeleton,
        subtreeRoot: newRoot,
        newAssumptions,
        namespace,
    }
}
