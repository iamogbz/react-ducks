import { createReducer } from "./createReducer";
import { createAction } from "./createAction";
import { getKeys } from "./utils/object";

function getNS<N extends string, T extends string, U extends string>(
    name: N,
    actionType: T,
): U {
    return `${name}/${actionType}` as U;
}

type CreateDuckReturnType<
    Name extends string,
    State,
    T extends Action,
    U extends string,
    Selectors extends Record<
        string,
        Selector<Record<Name, State>, unknown, unknown[]>
    >
> = Duck<
    Name,
    State,
    Record<T["type"], DuckActionCreators<T & { type: U }, State>>,
    Selectors &
        Record<DuckSelectorBaseKey, Selector<Record<Name, State>, State>>
>;

export function createDuck<
    Name extends string,
    State,
    T extends Action,
    // optional
    U extends string = string,
    Selectors extends Record<
        string,
        Selector<Record<Name, State>, unknown, unknown[]>
    > = Record<string, Selector<Record<Name, State>, unknown, unknown[]>>
>({
    name,
    initialState,
    reducers,
    selectors,
    actionMapping,
}: {
    name: Name;
    initialState: State;
    reducers: ActionReducerMapping<State, T>;
    selectors?: Selectors;
    actionMapping?: Record<U, T["type"]>;
}): CreateDuckReturnType<Name, State, T, U, Selectors> {
    type R = CreateDuckReturnType<Name, State, T, U, Selectors>;
    const mappedActionTypes = { ...actionMapping } as Record<U, T["type"]>;
    const actions = {} as R["actions"];
    for (const actionType of getKeys(reducers)) {
        const namespacedActionType = getNS<Name, Action["type"], U>(
            name,
            actionType,
        );
        actions[actionType] = createAction<U, T["payload"], State>(
            namespacedActionType,
        ) as DuckActionCreators<T & { type: U }>;
        mappedActionTypes[namespacedActionType] = actionType;
    }

    const actionReducer = createReducer(initialState, reducers);
    const isMappedActionType = (a?: Action<string>): a is Action<U> =>
        a !== undefined &&
        Object.prototype.hasOwnProperty.call(mappedActionTypes, a.type);

    const reducer: R["reducer"] = (state, action) => {
        if (!isMappedActionType(action)) return state;
        const type = mappedActionTypes[action.type];
        return actionReducer(state, { ...action, type });
    };

    return {
        actionTypes: getKeys(mappedActionTypes),
        actions,
        initialState,
        name,
        reducer,
        selectors: {
            $: (s: Record<Name, State>) => s[name],
            ...selectors,
        },
    } as R;
}
