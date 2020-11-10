import { getEntries } from "./getEntries";

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
): SelectorMapping<Record<N, S>, R, T, P, DuckSelectors<Q>> {
    const duckSelectors = {} as SelectorMapping<
        Record<N, S>,
        R,
        T,
        P,
        DuckSelectors<Q>
    >;
    const $ = (state: Record<N, S>) => state[duckName];
    Object.assign(duckSelectors, { $ });
    if (!selectors) return duckSelectors;
    for (const [q, s] of getEntries(selectors)) {
        duckSelectors[q] = (state) => s($(state));
    }
    return duckSelectors;
}
