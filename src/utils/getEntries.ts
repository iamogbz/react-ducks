export function getEntries<A extends string, B>(o: Record<A, B>): [A, B][] {
    return Object.entries(o) as [A, B][];
}
