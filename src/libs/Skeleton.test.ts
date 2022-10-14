import * as Skl from './Skeleton'
import { Skeleton, SkeletonNode } from '../core/types';
import clone from 'just-clone';
 
const BASIC: Skeleton = [
    {
        "id": "TCO",
        "eval": "GCP + Trading_Economics + Tableau",
        "assumptions": {
            "users": 1000
        }
    },
    {
        "id": "GCP",
        "eval": "BQ + GCS",
        "parent": "TCO"
    },
    {
        "id": "Tableau",
        "eval": "205",
        "parent": "TCO"
    },
    {
        "id": "Trading_Economics",
        "eval": "399",
        "parent": "TCO"
    },
    {
        "id": "BQ",
        "eval": "BQ_Storage * 0.02 + BQ_Query * users",
        "parent": "GCP"
    },
    {
        "id": "BQ_Storage",
        "eval": "0",
        "parent": "BQ"
    },
    {
        "id": "BQ_Query",
        "eval": "0.54",
        "parent": "BQ"
    },
    {
        "id": "GCS",
        "eval": "0.19",
        "parent": "GCP"
    }
]

test('no root node', () => {
    expect(() => {
        Skl.getRootNode([BASIC[1], BASIC[2]])
    }).toThrowError()
})

test('root node', () => {
    expect(Skl.getRootNode(BASIC)).toBe(BASIC[0])
})

test('get assumptions', () => {
    expect(Skl.getAssumptions(BASIC)).toBe(BASIC[0].assumptions)
})

test('replace assumptions normal', () => {
    const skeleton = clone(BASIC)
    const newAssumptions = { "hello": 200 }
    Skl.setAssumptions(skeleton, newAssumptions)
    expect(skeleton[0].assumptions).toBe(newAssumptions)
    expect(skeleton[0].assumptions).toStrictEqual({ "hello": 200 })
})

test('custom node assumptions', () => {
    const skeleton = clone(BASIC)
    const newAssumptions = { "hello": 200 }
    Skl.setAssumptions(skeleton, newAssumptions, skeleton[1])
    expect(skeleton[0]).toStrictEqual(BASIC[0])
    expect(skeleton[1]).toStrictEqual({
        "id": "GCP",
        "eval": "BQ + GCS",
        "parent": "TCO",
        "assumptions": { "hello": 200 }
    })
})

test('remove id', () => {
    const skeleton = clone(BASIC)
    const newSkeleton = Skl.removeIdsFromSkeleton(skeleton, ['BQ_Query', 'BQ', 'Tableau'])
    // Original skeleton should be unchanged (not in-place)
    expect(skeleton).toStrictEqual(BASIC)
    expect(newSkeleton).toStrictEqual([
        {
            "id": "TCO",
            "eval": "GCP + Trading_Economics + 0",
            "assumptions": {
                "users": 1000
            }
        },
        {
            "id": "GCP",
            "eval": "0 + GCS",
            "parent": "TCO"
        },
        BASIC[3],
        BASIC[7],
    ])
})

test('custom node assumptions', () => {
    const skeleton = clone(BASIC)
    const newAssumptions = { "hello": 200 }
    Skl.setAssumptions(skeleton, newAssumptions, skeleton[1])
    expect(skeleton[0]).toStrictEqual(BASIC[0])
    expect(skeleton[1]).toStrictEqual({
        "id": "GCP",
        "eval": "BQ + GCS",
        "parent": "TCO",
        "assumptions": { "hello": 200 }
    })
})

test('traverse subtree', () => {
    const allNodes: string[] = []
    Skl.traverseSkeleton(BASIC, "GCP", (sk: SkeletonNode) => {
        allNodes.push(sk.id)
        return false
    })
    expect(allNodes).toStrictEqual(["GCP", "GCS", "BQ", "BQ_Query", "BQ_Storage"])
})

test('traverse subtree early stop', () => {
    const allNodes: string[] = []
    Skl.traverseSkeleton(BASIC, "TCO", (sk: SkeletonNode) => {
        allNodes.push(sk.id)
        if (sk.id == "GCP") return true
        return false
    })
    expect(allNodes).toStrictEqual(["TCO", "Trading_Economics", "Tableau", "GCP"])
})

test('rename assumption', () => {
    const skeleton = clone(BASIC)
    const newSkeleton = Skl.renameAssumptionInSkeleton(skeleton, "users", "people")
    // Original skeleton should be unchanged (not in-place)
    expect(skeleton).toStrictEqual(BASIC)
    expect(newSkeleton[0]).toStrictEqual({
        "id": "TCO",
        "eval": "GCP + Trading_Economics + Tableau",
        "assumptions": {
            "people": 1000
        }
    })
    expect(newSkeleton[4]).toStrictEqual({
        "id": "BQ",
        "eval": "BQ_Storage * 0.02 + BQ_Query * people",
        "parent": "GCP"
    })
})

test('rename assumption', () => {
    const skeleton = clone(BASIC)
    const newSkeleton = Skl.renameAssumptionInSkeleton(skeleton, "users", "people")
    // Original skeleton should be unchanged (not in-place)
    expect(skeleton).toStrictEqual(BASIC)
    expect(newSkeleton[0]).toStrictEqual({
        "id": "TCO",
        "eval": "GCP + Trading_Economics + Tableau",
        "assumptions": {
            "people": 1000
        }
    })
    expect(newSkeleton[4]).toStrictEqual({
        "id": "BQ",
        "eval": "BQ_Storage * 0.02 + BQ_Query * people",
        "parent": "GCP"
    })
})

test('rename assumption nonexistent', () => {
    expect(() => {
        Skl.renameAssumptionInSkeleton(clone(BASIC), "nonexistent", "people")
    }).toThrowError()
})

test('rename assumption name conflict', () => {
    expect(() => {
        Skl.renameAssumptionInSkeleton(clone(BASIC), "users", "users")
    }).toThrowError()
})

test('rename assumption node conflict', () => {
    expect(() => {
        Skl.renameAssumptionInSkeleton(clone(BASIC), "users", "BQ")
    }).toThrowError()
})

test('rename node in skeleton', () => {
    const skeleton = clone(BASIC)
    const newSkeleton = Skl.renameNodeInSkeleton(skeleton, "BQ_Storage", "BigQueryStorage")
    // Original skeleton should be unchanged (not in-place)
    expect(skeleton).toStrictEqual(BASIC)
    expect(newSkeleton).toStrictEqual([
        BASIC[0], BASIC[1], BASIC[2], BASIC[3],
        {
            "id": "BQ",
            "eval": "BigQueryStorage * 0.02 + BQ_Query * users",
            "parent": "GCP"
        },
        {
            "id": "BigQueryStorage",
            "eval": "0",
            "parent": "BQ"
        },
        BASIC[6], BASIC[7],
    ])
})

test('rename node in skeleton node conflict', () => {
    expect(() => {
        Skl.renameNodeInSkeleton(clone(BASIC), "BQ_Storage", "Tableau")
    }).toThrowError()
})

test('rename node in skeleton assumption conflict', () => {
    expect(() => {
        Skl.renameNodeInSkeleton(clone(BASIC), "BQ_Storage", "users")
    }).toThrowError()
})

test('rename node in skeleton nonexistent', () => {
    expect(() => {
        Skl.renameNodeInSkeleton(clone(BASIC), "nonexistent", "dummy")
    }).toThrowError()
})

test('change node eval', () => {
    const skeleton = clone(BASIC)
    const newSkeleton = Skl.changeNodeEvalInSkeleton(skeleton, "GCP", "GCS  # Modified")
    // Original skeleton should be unchanged (not in-place)
    expect(skeleton).toStrictEqual(BASIC)
    expect(newSkeleton).toStrictEqual([
        BASIC[0],
        {
            "id": "GCP",
            "eval": "GCS  # Modified",
            "parent": "TCO"
        },
        BASIC[2], BASIC[3], BASIC[7]
    ])
})

test('change node eval nonexistent', () => {
    expect(() => {
        Skl.changeNodeEvalInSkeleton(clone(BASIC), "nonexistent", "dummy")
    }).toThrowError()
})

test('change node eval new node', () => {
    expect(() => {
        Skl.changeNodeEvalInSkeleton(clone(BASIC), "GCP", "BQ + GCS + Tableau")
    }).toThrowError()
})

test('get namespace', () => {
    expect(Skl.getNamespace(BASIC)).toStrictEqual(["TCO","GCP","Tableau","Trading_Economics","BQ","BQ_Storage","BQ_Query","GCS","users"])
})
