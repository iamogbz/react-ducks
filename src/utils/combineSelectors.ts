export function combineSelectors<
    S,
    T extends string,
    P,
    R,
    N extends string,
    Q extends string
>(
    duckName: N,
    selectors?: SelectorMapping<S, R, T, P, Q>,
): Nullable<SelectorMapping<S, R, T, P, Q>> {
    if (!selectors) return;
    const duckSelectors = {} as SelectorMapping<S, R, T, P, Q>;
    for (const s of Object.keys(selectors) as Q[]) {
        duckSelectors[s] = (state: S): R =>
            selectors[s](((state as unknown) as Record<string, S>)[duckName]);
    }
    return duckSelectors;
}
