import { combineReducers } from "./utils/combineReducers";

export function createRootDuck<
    D extends Duck<S, N, T, P, R, Q>,
    S = D extends infer _D ? (_D extends Duck<infer _S> ? _S : never) : never,
    N extends string = D extends infer _D
        ? _D extends Duck<S, infer _N>
            ? _N
            : never
        : never,
    T extends string = D extends infer _D
        ? _D extends Duck<S, N, infer _T>
            ? _T
            : never
        : never,
    P = D extends infer _D
        ? _D extends Duck<S, N, T, infer _P>
            ? _P
            : never
        : never,
    R = D extends infer _D
        ? _D extends Duck<S, N, T, P, infer _R>
            ? _R
            : never
        : never,
    Q extends string = D extends infer _D
        ? _D extends Duck<S, N, T, P, R, infer _Q>
            ? _Q
            : never
        : never
>(...ducks: D[]): RootDuck<S, N, T, P, R, Q> {
    const rootDuck = {
        actions: {},
        initialState: {},
        names: new Set(ducks.map((d) => d.name)),
        selectors: {},
    } as RootDuck<S, N, T, P, R, Q>;
    const reducerMapping = {} as DuckReducerMapping<S, N, T, P>;
    for (const duck of ducks) {
        const duckName = duck.name;
        rootDuck.actions[duckName] = duck.actions as ActionCreatorMapping<
            T,
            P,
            S
        >;
        rootDuck.initialState[duckName] = duck.initialState;
        rootDuck.selectors[duckName] = duck.selectors;
        reducerMapping[duckName] = duck.reducer;
    }
    rootDuck.reducer = combineReducers(rootDuck.initialState, reducerMapping);
    return rootDuck;
}
