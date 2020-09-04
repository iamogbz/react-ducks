import { combineReducers } from "./utils/combineReducers";

type State = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export function createRootDuck(...ducks: Duck<State>[]): RootDuck<State> {
    const {
        actions,
        initialState,
        names,
        reducerMapping,
        selectors,
    } = ducks.reduce(
        (acc, duck) => {
            acc.names.add(duck.name);
            acc.actions[duck.name] = duck.actions;
            acc.selectors[duck.name] = duck.selectors;
            acc.reducerMapping[duck.name] = duck.reducer;
            acc.initialState[duck.name] = duck.initialState;
            return acc;
        },
        {
            actions: {},
            initialState: {},
            names: new Set(),
            reducerMapping: {},
            selectors: {},
        } as {
            reducerMapping: ReducerMapping<State>;
        } & RootDuck<State>,
    );
    const reducer = combineReducers(initialState, reducerMapping);

    return {
        actions,
        initialState,
        names,
        reducer,
        selectors,
    };
}
