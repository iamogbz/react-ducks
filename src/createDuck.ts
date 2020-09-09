import { createReducer } from "./createReducer";
import { createAction } from "./createAction";
import { getEntries } from "./utils/getEntries";

function getNS<N extends string, T extends string, V extends string>(
    name: N,
    actionType: T,
): V {
    return `${name}/${actionType}` as V;
}

function reverseMap<A extends string, B extends string>(
    map?: Record<A, B>,
): Record<B, Set<A>> {
    if (!map) return {} as Record<B, Set<A>>;
    const reversedMap = {} as Record<B, Set<A>>;
    for (const [mappedActionType, actionType] of getEntries(map)) {
        if (!reversedMap[actionType]) {
            reversedMap[actionType] = new Set<A>();
        }
        reversedMap[actionType].add(mappedActionType);
    }
    return reversedMap;
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
    reducers: ActionReducerMapping<S, U, P>;
    selectors?: SelectorMapping<S, R, T, P, Q>;
    actionMapping?: Record<T, U>;
}): Duck<S, N, T, P, R, Q, U> {
    const mappedActionTypes = reverseMap(actionMapping);
    const actions = {} as ActionCreatorMapping<T, P, S, U>;
    const namedspacedReducers = {} as ActionReducerMapping<S, T, P>;
    for (const [actionType, reducer] of getEntries(reducers)) {
        const namespacedActionType = getNS<N, U, T>(name, actionType);
        actions[actionType] = createAction(namespacedActionType);
        const mappedReducer = (reducer as unknown) as Reducer<S, T, P>;
        namedspacedReducers[namespacedActionType] = mappedReducer;
        if (mappedActionTypes[actionType]) {
            for (const mappedActionType of mappedActionTypes[actionType]) {
                namedspacedReducers[mappedActionType] = mappedReducer;
            }
        }
    }

    const reducer: Reducer<S, T, P> = createReducer(
        initialState,
        namedspacedReducers,
    );

    return {
        actions,
        initialState,
        name,
        reducer,
        selectors,
    };
}
