import { createReducer } from "./createReducer";
import { createAction } from "./createAction";
import { getEntries } from "./utils/getEntries";
import { combineSelectors } from "./utils/combineSelectors";

function getNS<N extends string, T extends string, V extends string>(
    name: N,
    actionType: T,
): V {
    return `${name}/${actionType}` as V;
}

export function createDuck<
    S,
    P,
    R,
    T extends string,
    U extends string,
    N extends string,
    Q extends string
>({
    name,
    initialState,
    reducers,
    selectors,
    actionMapping,
}: {
    name: N;
    initialState: S;
    reducers: ActionReducerMapping<S, U, P>; // Reducers = { CreatorName: Reducer(State, ActionType, PayloadTypes) }
    selectors?: SelectorMapping<S, R, T, P, Q>;
    actionMapping?: Record<T, U>; // ActionMapping = { MappedActionType: ActionType }
}): Duck<S, N, T, P, R, Q, U> {
    const mappedActionTypes = { ...actionMapping } as Record<T, U>;
    const actions = {} as ActionCreatorMapping<T, P, S, U>;
    for (const [actionType] of getEntries(reducers)) {
        const namespacedActionType = getNS<N, U, T>(name, actionType);
        actions[actionType] = createAction(namespacedActionType);
        mappedActionTypes[namespacedActionType] = actionType;
    }

    const actionReducer = createReducer<S, P, U>(initialState, reducers);
    const isMappedActionType = (a?: Action<string, P>): a is Action<T, P> =>
        a !== undefined &&
        Object.prototype.hasOwnProperty.call(mappedActionTypes, a.type);
    function reducer(state: S, action: Action<T, P> | Action<U, P>): S {
        return actionReducer(state, {
            ...action,
            type: isMappedActionType(action)
                ? mappedActionTypes[action.type]
                : action.type,
        });
    }

    return {
        actions,
        initialState,
        name,
        reducer,
        selectors: combineSelectors(name, selectors),
    };
}
