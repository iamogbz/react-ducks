import { combineReducers } from "./utils/combineReducers";

export function createRootDuck<
    S = any, // eslint-disable-line @typescript-eslint/no-explicit-any
    N extends string = string,
    U extends string = string,
    V extends string = string,
    T extends U | V = U | V,
    P = any, // eslint-disable-line @typescript-eslint/no-explicit-any
    R = any, // eslint-disable-line @typescript-eslint/no-explicit-any
    Q extends string = string,
    D extends Duck<S, N, T, P, R, Q, U>[] = Duck<S, N, T, P, R, Q, U>[]
>(...ducks: D): RootDuck<S, N, U, V, T, P, R, Q> {
    const rootDuck = {
        actions: {},
        initialState: {},
        names: new Set(ducks.map((d) => d.name)),
        selectors: {},
    } as RootDuck<S, N, U, V, T, P, R, Q>;
    const reducerMapping = {} as DuckReducerMapping<S, N, T, P>;
    for (const duck of ducks) {
        const duckName = duck.name;
        rootDuck.actions[duckName] = duck.actions;
        rootDuck.initialState[duckName] = duck.initialState;
        rootDuck.selectors[duckName] = duck.selectors;
        reducerMapping[duckName] = duck.reducer;
    }
    rootDuck.reducer = combineReducers(rootDuck.initialState, reducerMapping);
    return rootDuck;
}
