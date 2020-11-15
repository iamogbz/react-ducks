import { combineReducers } from "./utils/combineReducers";

export function createRootDuck<
    DD extends Duck<
        Names,
        State,
        Record<string, DuckActionCreators<T, State>>
    >[],
    // optional
    Names extends string = string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    State = any,
    T extends Action = Action
>(...ducks: DD): RootDuck<DD> {
    const rootDuck = {
        actions: {},
        initialState: {},
        selectors: {},
    } as RootDuck<DD>;
    const reducerMapping = {} as Transpose<DD[number], "name", "reducer">;
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
