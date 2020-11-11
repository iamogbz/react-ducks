import { createReducer } from "./createReducer";
import { createAction } from "./createAction";
import { getKeys } from "./utils/object";

function getNS<N extends string, T extends string, U extends string>(
    name: N,
    actionType: T,
): U {
    return `${name}/${actionType}` as U;
}

export function createDuck<
    S,
    N extends string,
    U extends string /* eventual namespaced action types */,
    P,
    T extends string /* action type creator keys from reducer mapping */,
    E extends unknown[],
    Q extends string,
    R
>({
    name,
    initialState,
    reducers,
    selectors,
    actionMapping,
}: {
    name: N;
    initialState: S;
    reducers: ActionReducerMapping<S, T, P>;
    selectors?: SelectorMapping<Record<N, S>, Q, R, E, T, P>;
    actionMapping?: Record<U, T>;
}): Duck<N, S, U, P, T, Q, R, E> {
    const mappedActionTypes = { ...actionMapping } as Record<U, T>;
    const actions = {} as ActionCreatorMapping<T, U, P, S>;
    for (const actionType of getKeys(reducers)) {
        const namespacedActionType = getNS<N, T, U>(name, actionType);
        actions[actionType] = createAction(namespacedActionType);
        mappedActionTypes[namespacedActionType] = actionType;
    }

    const actionReducer = createReducer(initialState, reducers);
    const isMappedActionType = (a?: Action<string, P>): a is Action<U, P> =>
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
        actionTypes: getKeys(mappedActionTypes),
        actions,
        initialState,
        name,
        reducer,
        selectors: {
            $: (s) => s[name],
            ...selectors,
        } as SelectorMapping<Record<N, S>, DuckSelectors<Q>, R, E, T, P>,
    };
}
