import { combineReducers } from "./utils/combineReducers";

export function createRootDuck<
    D extends Duck<N, S, T, P, C, Q, R, E>,
    N extends string /* Duck names */,
    S /* State types */,
    T extends string /* Action types */,
    P /* Payload types */,
    C extends string /* Action creator keys */,
    Q extends string /* Selector keys */,
    R /* Selector return types */,
    E extends unknown[] /* Selector extra arguments */
>(...ducks: D[]): RootDuck<N, S, T, P, C, Q, R, E> {
    type Return = RootDuck<N, S, T, P, C, Q, R, E>;

    const rootDuck = {
        actions: {},
        initialState: {},
        names: new Set(ducks.map((d) => d.name)),
        selectors: {},
    } as Optional<Return, "reducer">;

    const reducerMapping = {} as DuckReducerMapping<N, S, T, P>;
    for (const duck of ducks) {
        const duckName = duck.name;
        rootDuck.actions[duckName] = duck.actions;
        rootDuck.initialState[duckName] = duck.initialState;
        rootDuck.selectors[duckName] = duck.selectors;
        reducerMapping[duckName] = duck.reducer;
    }
    rootDuck.reducer = combineReducers(rootDuck.initialState, reducerMapping);
    return rootDuck as Return;
}
