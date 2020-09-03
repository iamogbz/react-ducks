export function createReducer<State>(
    initialState: State,
    actionHandlers: ActionReducerMapping<State>,
    defaultHandler: Reducer<State> = (s): State => s,
): Reducer<State> {
    return (state = initialState, action?): State => {
        for (const [actionType, reducer] of Object.entries(actionHandlers)) {
            if (actionType === action?.type) {
                return reducer(state, action);
            }
        }
        return defaultHandler(state, action);
    };
}
