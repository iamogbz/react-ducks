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
): Nullable<SelectorMapping<Record<N, S>, R, T, P, Q>> {
    if (!selectors) return;
    const duckSelectors = {} as SelectorMapping<Record<N, S>, R, T, P, Q>;
    for (const [q, s] of getEntries(selectors)) {
        duckSelectors[q] = (state) => s(state[duckName]);
    }
    return duckSelectors;
}
