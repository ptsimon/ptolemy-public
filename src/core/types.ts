export type Assumptions = Record<string, number>

export type SkeletonNode = {
    id: string
    eval: string
    parent?: string
    values?: Record<string, unknown>  // Should this be in the skeleton?
    assumptions?: Assumptions
    units?: string
    proj_name?: string
}

export type Skeleton = SkeletonNode[]

export type ProjectName = string
