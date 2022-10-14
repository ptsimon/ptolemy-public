import clone from 'just-clone'
import { Unit } from '../components/widgets/chart/ChartPopup'
import { Assumptions, Skeleton, SkeletonNode } from '../core/types'
import { getNodeNamesInExpression, mathParse, replaceNodeInExpression } from './Math'
import { setIntersection, UnexpectedError } from './Misc'

// TODO look into changing this
const ROOT_NODE_NAME = 'TCO'

export type SkeletonConsumerProps = {
    skeleton: Skeleton
    setSkeleton: (skeleton: Skeleton) => void
}

export const getRootNode = (skeleton: Skeleton): SkeletonNode => {
    const rootNode = skeleton.find((node: SkeletonNode) => node.id === ROOT_NODE_NAME)
    if (!rootNode) {
        console.error(skeleton)
        throw Error("TCO Node not found in skeleton")
    }
    return rootNode
}

export const isRootNode = (nodeOrId: SkeletonNode | string | undefined): boolean => {
    if (!nodeOrId) return false
    if (typeof nodeOrId === 'string' || nodeOrId instanceof String) {
        return nodeOrId == ROOT_NODE_NAME
    } else {
        return nodeOrId.id == ROOT_NODE_NAME
    }
}

export const getAssumptions = (skeleton?: Skeleton, customRootNode?: SkeletonNode): Assumptions => {
    if (!skeleton) return {}
    const rootNode = customRootNode ?? getRootNode(skeleton)
    return rootNode.assumptions ?? {}
}

export const setAssumptions = (skeleton: Skeleton, newAssumptions: Assumptions, customRootNode?: SkeletonNode): void => {
    // Check for naming conflicts between skeleton names and assumption names
    const skeletonIds = new Set(skeleton.map(n => n.id))
    const assumptionIds = Object.keys(newAssumptions)
    const conflicts = setIntersection(assumptionIds, skeletonIds)
    if (conflicts.length > 0) {
        throw new Error(`The ff names are already present in the skeleton: ${conflicts.join(", ")}`)
    }

    // Assign to root node
    const rootNode = customRootNode ?? getRootNode(skeleton)
    rootNode.assumptions = newAssumptions
}

export const getNonRootNodes = (skeleton: Skeleton): SkeletonNode[] => {
    return skeleton.filter((node: SkeletonNode) => node.id !== ROOT_NODE_NAME)
}

export const getChildrenOfNode = (skeleton: Skeleton, id?: string): SkeletonNode[] => {
    return skeleton.filter((node: SkeletonNode) => node.parent == id)
}

export const findIdInSkeleton = (skeleton: Skeleton, id?: string): SkeletonNode | undefined => {
    return skeleton.find((node: SkeletonNode) => node.id == id)
}

export const isNodeInSkeleton = (skeleton: Skeleton, id?: string): boolean => {
    return !!skeleton.find((node: SkeletonNode) => node.id == id)
}

export const getAllSkeletonIds = (skeleton: Skeleton): Array<string> => {
    return skeleton.map((sk) => sk.id)
}

export const removeIdFromSkeleton = (skeleton: Skeleton, id: string): Skeleton => {
    return removeIdsFromSkeleton(skeleton, [id])
}

// Note: this operation is NOT in place
export const removeIdsFromSkeleton = (skeleton: Skeleton, idsToRemove: string[]): Skeleton => {
    skeleton = clone(skeleton)
    while (idsToRemove.length > 0) {
        const curId = idsToRemove.pop()
        if (!curId) continue

        // Update formula of parent node in skeleton
        const skNode = findIdInSkeleton(skeleton, curId)
        if (!skNode) continue // Node may already be removed by some other operation (e.g. as a child)
        const parentSkNode = findIdInSkeleton(skeleton, skNode.parent)
        if (parentSkNode) {
            const newParentExp = replaceNodeInExpression(mathParse(parentSkNode.eval), curId, "0")
            parentSkNode.eval = newParentExp.toString()
        }
        
        // Remove children
        idsToRemove = getChildrenOfNode(skeleton, curId)
            .map((n) => n.id)
            .concat(idsToRemove)

        // Remove node
        skeleton = skeleton.filter((node: SkeletonNode) => node.id != curId)
    }
    return skeleton
}

// If traverse(curNode) returns TRUE, the nodes of curNode will not be visited
export const traverseSkeleton = (skeleton: Skeleton, fromNodeId: string | undefined, traverse: (node: SkeletonNode) => boolean): void => {
    const toVisit: string[] = [fromNodeId ?? ROOT_NODE_NAME]
    while (toVisit.length > 0) {
        const curId = toVisit.pop()
        const curNode = findIdInSkeleton(skeleton, curId)
        if (!curNode) throw new Error(`Traversal error: ${curId} not found in skeleton`)
        const stopTraversal = traverse(curNode)
        if (!stopTraversal) {
            getChildrenOfNode(skeleton, curId).forEach((c) => toVisit.push(c.id))
        }
    }
}

// Note: this operation is NOT in place
export const changeNodeUnitsInSkeleton = (skeleton: Skeleton, nodeId: string, newUnits: Unit): Skeleton => {
    const newSkeleton = clone(skeleton)
    const customRootNode = findIdInSkeleton(newSkeleton, nodeId)
    if (!customRootNode) throw new Error(`Cannot find node ID ${nodeId} in skeleton`)
    customRootNode.units = newUnits.format
    return newSkeleton
}

// Note: this operation is NOT in place
export const renameAssumptionInSkeleton = (skeleton: Skeleton, oldName: string, newName: string, customRootName?: string): Skeleton => {
    const newSkeleton = clone(skeleton)
    const skeletonIds = newSkeleton.map(n => n.id)
    const customRootNode = findIdInSkeleton(newSkeleton, customRootName)
    const assumptions = clone(getAssumptions(newSkeleton, customRootNode))
    if (!(oldName in assumptions)) throw new Error(`Error renaming assumption ${oldName} → ${newName}: '${oldName}' does not exist in the assumptions`)
    if (newName in assumptions) throw new Error(`Error renaming assumption ${oldName} → ${newName}: '${newName}' already exists in the assumptions`)
    if (newName in skeletonIds) throw new Error(`Error renaming assumption ${oldName} → ${newName}: '${newName}' conflicts with a skeleton node name`)

    // Replace assumptions in skeleton expressions (evals)
    newSkeleton.forEach(skNode => {
        const newParentExp = replaceNodeInExpression(mathParse(skNode.eval), oldName, newName)
        skNode.eval = newParentExp.toString()
    })

    // Replace in assumptions object
    assumptions[newName] = assumptions[oldName]
    delete assumptions[oldName]
    setAssumptions(newSkeleton, assumptions, customRootNode)

    return newSkeleton
}

// Note: this operation is NOT in place
export const renameNodeInSkeleton = (skeleton: Skeleton, oldId: string, newId: string, customAssumptions?: Assumptions): Skeleton => {
    const newSkeleton = clone(skeleton)
    const assumptions = customAssumptions ?? getAssumptions(skeleton)
    if (isNodeInSkeleton(newSkeleton, newId)) throw new Error(`Error renaming node ${oldId} → ${newId}: '${newId}' already exists in the skeleton`)
    if (newId in assumptions) throw new Error(`Error renaming node ${oldId} → ${newId}: '${newId}' is the name of an assumption`)

    const nodeToRename = findIdInSkeleton(newSkeleton, oldId)
    if (!nodeToRename) throw new Error(`Error renaming ${oldId} → ${newId}: '${oldId}' is not found in the skeleton`)

    // Change parent formula
    const parentNode = findIdInSkeleton(newSkeleton, nodeToRename.parent)
    if (parentNode) {
        const newParentExp = replaceNodeInExpression(mathParse(parentNode.eval), oldId, newId)
        parentNode.eval = newParentExp.toString()
    }
    // Change children parent
    getChildrenOfNode(newSkeleton, oldId).forEach((child) => {
        if (child.parent == oldId) {
            child.parent = newId
        }
    })
    // Change node ID
    nodeToRename.id = newId
    return newSkeleton
}

export const changeNodeEvalInSkeleton = (skeleton: Skeleton, id: string, newEval: string): Skeleton => {
    let newSkeleton = clone(skeleton)
    const nodeToChange = findIdInSkeleton(newSkeleton, id)
    if (!nodeToChange) throw new Error(`Error changing ${id}: not found in the skeleton`)

    // Ensure that new children as specified in newEval are a subset of the current children
    const curChildrenIds = getChildrenOfNode(newSkeleton, id).map((n) => n.id)
    const curChildrenSet = new Set(curChildrenIds)
    const newChildrenIds = getNodeNamesInExpression(mathParse(newEval))
    const newChildrenSet = new Set(newChildrenIds)

    // Ensure there are no "totally new" nodes in the new eval formula
    const assumptions = getAssumptions(newSkeleton)
    const totallyNewChildren = newChildrenIds
        .filter((newChildId) => !curChildrenSet.has(newChildId))   // Filter out current children
        .filter((newChildId) => !(newChildId in assumptions))      // Filter out assumptions
    if (totallyNewChildren.length > 0) {
        throw new Error(`New nodes cannot be added through Edit Node.\nPlease remove the ff: ${totallyNewChildren.join(", ")}`)
    }

    // Delete children which are no longer in the new eval
    const childrenToBeDeleted = curChildrenIds.filter((curChildId) => !newChildrenSet.has(curChildId))
    newSkeleton = removeIdsFromSkeleton(newSkeleton, childrenToBeDeleted)

    // Update eval of node
    const curNode = findIdInSkeleton(newSkeleton, id)  // Get node again as skeleton has already been recreated
    if (!curNode) throw new UnexpectedError(`changeNodeEvalInSkeleton: ${id} not found in newSkeleton`)
    curNode.eval = newEval

    return newSkeleton
}

export const findParentsInSkeleton = (skeleton: Skeleton, id: string): SkeletonNode[] => {
    return skeleton.filter((node: SkeletonNode) => node.parent != id)
}

export const getNamespace = (skeleton: Skeleton | undefined, customRootNode?: SkeletonNode): string[] => {
    if (!skeleton) return []
    const names: Set<string> = new Set(skeleton.map(n => n.id))
    Object.keys(getAssumptions(skeleton, customRootNode))
        .forEach(a => {
            if (names.has(a)) throw new UnexpectedError(`Naming Conflict: skeleton and assumptions both have name '${a}'`)
            names.add(a)
        })
    return Array.from(names)
}