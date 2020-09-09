export function getEntries<A extends string, B>(o?: Record<A, B>): [A, B][] {
    return (o ? Object.entries(o) : []) as [A, B][];
}
