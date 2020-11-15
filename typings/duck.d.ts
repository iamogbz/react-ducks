type Action<
    // optional
    Type extends string = string,
    Payload = unknown
> = {
    type: Type;
    payload?: Payload;
};

type ActionDispatcher<
    T extends Action,
    // optional
    Arguments extends unknown[] = never[]
> = (p?: T["payload"], ...args: Arguments) => void;

type ActionPayloadMapping<ActionType extends string, Payload> = Record<
    ActionType,
    Payload
>;

type Reducer<State, T extends Action> = React.Reducer<State, T>;

type ActionMatching<T extends Action, K extends string> = Extract<
    T,
    { type: K }
>;

type ActionReducerMapping<State, T extends Action> = {
    [K in T["type"]]: Reducer<State, ActionMatching<T, K>>;
};

type ActionCreator<Type extends string, Payload = unknown, State = unknown> = (
    payload?: Payload,
) => React.ReducerAction<Reducer<State, Action<Type, Payload>>>;

type Selector<
    State,
    Returns, // optional
    ExtraArguments extends unknown[] = never[]
> = (state: State, ...args: ExtraArguments) => Returns;

type DuckActionCreators<
    T extends Action,
    // optional
    State = unknown
> = {
    [K in T["type"]]: (
        payload?: ActionMatching<T, K>["payload"],
    ) => React.ReducerAction<Reducer<State, ActionMatching<T, K>>>;
}[T["type"]];

type DuckSelectorBaseKey = "$";

type Duck<
    Name extends string,
    State,
    ActionCreatorMapping extends Record<
        CreatorKeys,
        DuckActionCreators<Actions, State>
    >,
    // optional
    SelectorMapping extends Record<SelectorKeys, Selectors> = Record<
        SelectorKeys,
        Selectors
    >,
    CreatorKeys extends string = string,
    ActionTypes extends string = string,
    Payload = unknown,
    Actions extends Action<ActionTypes, Payload> = Action<ActionTypes, Payload>,
    SelectorKeys extends string = string,
    SelectorReturns = unknown,
    SelectorArguments extends unknown[] = never[],
    Selectors extends Selector<
        Record<Name, State>,
        SelectorReturns,
        SelectorArguments
    > = Selector<Record<Name, State>, SelectorReturns, SelectorArguments>
> = {
    actions: ActionCreatorMapping;
    actionTypes: ReturnType<
        ActionCreatorMapping[keyof ActionCreatorMapping]
    >["type"][];
    initialState: State;
    name: Name;
    reducer: Reducer<
        State,
        ReturnType<ActionCreatorMapping[keyof ActionCreatorMapping]>
    >;
    selectors: SelectorMapping &
        Record<DuckSelectorBaseKey, Selector<Record<Name, State>, State>>;
};

type RootReducer<
    ReducerMapping extends Record<Names, Reducer<State, Actions>>,
    // optional
    Names extends string = string,
    State = unknown,
    ActionTypes extends string = string,
    Payload = unknown,
    Actions extends Action<ActionTypes, Payload> = Action<ActionTypes, Payload>
> = Reducer<
    { [K in keyof ReducerMapping]: Parameters<ReducerMapping[K]>[0] },
    Parameters<ReducerMapping[keyof ReducerMapping]>[1]
>;

type RootDuck<Ducks extends Duck[]> = {
    actions: Transpose<Ducks[number], "name", "actions">;
    initialState: Transpose<Ducks[number], "name", "initialState">;
    names: Ducks[number]["name"][];
    reducer: RootReducer<Transpose<Ducks[number], "name", "reducer">>;
    selectors: Transpose<Ducks[number], "name", "selectors">;
};
