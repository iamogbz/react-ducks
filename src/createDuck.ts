import { createReducer } from "./createReducer";
import { createAction } from "./createAction";

function getNS<ActionType extends string>(
    name: string,
    actionType: ActionType,
): string {
    return `${name}/${actionType}`;
}

export function createDuck<State>({
    name,
    initialState,
    reducers,
    selectors,
}: {
    name: string;
    initialState: State;
    reducers: ActionReducerMapping<State>;
    selectors?: Record<string, Selector<State>>;
}): Duck<State> {
    const actions = Object.keys(reducers).reduce((axns, actionType) => {
        axns[getNS(name, actionType)] = createAction(actionType);
        return axns;
    }, {} as Duck<State>["actions"]);

    const reducer = createReducer(initialState, reducers);

    return {
        name,
        actions,
        reducer,
        selectors,
    };
}
