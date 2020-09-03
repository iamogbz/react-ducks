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
    reducers: ReducerMapping<State>;
    selectors?: Record<string, Selector<State>>;
}): Duck<State> {
    const actionTypes = Object.keys(reducers);
    const actions: Duck<State>["actions"] = {};
    const namespacedActionTypeMapping: Record<string, string> = {};
    for (const actionType of actionTypes) {
        const namespacedActionType = getNS(name, actionType);
        actions[actionType] = createAction(actionType);
        namespacedActionTypeMapping[namespacedActionType] = actionType;
    }

    const reducer = createReducer(
        initialState,
        reducers,
        namespacedActionTypeMapping,
    );

    return {
        actions,
        initialState,
        name,
        reducer,
        selectors,
    };
}
