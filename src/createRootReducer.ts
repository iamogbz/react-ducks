type State = any; // eslint-disable-line @typescript-eslint/no-explicit-any

function combineReducers(
    initialState: Record<string, State>,
    reducerMapping: ReducerMapping<State>,
): Reducer<Record<string, State>> {
    const reducers = Object.entries(reducerMapping);
    return function (
        state: Record<string, State> = initialState,
        action,
    ): Record<string, State> {
        return reducers.reduce((acc, [name, reducer]) => {
            acc[name] = reducer(state[name], action);
            return acc;
        }, {} as Record<string, State>);
    };
}

export function createRootReducer(
    ...ducks: Duck<State>[]
): Reducer<Record<string, State>> {
    const { initialState, reducerMapping } = ducks.reduce(
        (acc, duck) => {
            acc.reducerMapping[duck.name] = duck.reducer;
            acc.initialState[duck.name] = duck.initialState;
            return acc;
        },
        { initialState: {}, reducerMapping: {} } as {
            initialState: Record<string, State>;
            reducerMapping: ReducerMapping<State>;
        },
    );
    return combineReducers(initialState, reducerMapping);
}
