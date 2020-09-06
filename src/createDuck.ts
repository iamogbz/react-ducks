import { createReducer } from "./createReducer";
import { createAction } from "./createAction";

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
    T extends U | V,
    U extends string,
    V extends string,
    N extends string,
    Q extends string
>({
    name,
    initialState,
    reducers,
    selectors,
}: {
    name: N;
    initialState: S;
    reducers: ReducerMapping<S, U, P>;
    selectors?: SelectorMapping<S, R, T, P, Q>;
}): Duck<S, N, T, P, R, Q> {
    const actions: ActionCreatorMapping<U, P, S> = {};
    const namespacedActionTypeMapping = {} as Record<V, U>;
    for (const actionType of Object.keys(reducers) as U[]) {
        actions[actionType] = createAction(actionType);
        namespacedActionTypeMapping[
            getNS<N, U, V>(name, actionType)
        ] = actionType;
    }

    const reducer = createReducer(
        initialState,
        reducers,
        namespacedActionTypeMapping,
    ) as Reducer<S, T, P>;

    return {
        actions,
        initialState,
        name,
        reducer,
        selectors,
    } as Duck<S, N, T, P, R, Q>;
}
