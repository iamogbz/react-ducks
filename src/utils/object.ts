export function getKeys<O extends Record<string, unknown>>(o: O): (keyof O)[] {
    return Object.keys(o);
}
