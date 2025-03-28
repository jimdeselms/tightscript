import { ShaRegistry } from "./ShaRegistry"

export class ExpressionRegistry {
    private readonly registry: ShaRegistry
    constructor(registry: ShaRegistry) {
        this.registry = registry
    }
}


type Type = {
    name: string

    /**
     * Is this thing a member of this type?
     */
    predicate: (x: unknown) => boolean

    /**
     * If an object is a member of this type, then it can be converted into each of these other types
     */
    compatibleTypes: Record<string, MappingFn>

    /**
     * If an object is a member of this type, then it can have these actiosn performed on it.
     */
    actions: Record<string, Action>
}

type Action = {
    fn: MappingFn
    resultType: string
}

type MappingFn = (x: unknown) => unknown