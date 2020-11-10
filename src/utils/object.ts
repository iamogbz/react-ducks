export function getEntries<A extends string, B>(o: Record<A, B>): [A, B][] {
    return Object.entries(o) as [A, B][];
}

export function getKeys<A extends string>(o: Record<A, unknown>): A[] {
    return Object.keys(o) as A[];
}
