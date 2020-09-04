type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Action<T, P>;

type ContextEnhancer<S> = (v: ContextValue<S>) => ContextValue<S>;

// this is equivalent to a redux store
type ContextValue<S, T extends string = string, P = unknown> = {
    dispatch: ContextDispatch<T, P>;
    enhancer: ContextEnhancer<S>;
    reducer: Reducer<S>;
    replaceReducer: (r: Reducer<NS>) => Context<NS>;
    state: S;
} & Observable;

type Context<S, T extends string = string, P = unknown> = React.Context<
    ContextValue<S>
>;

// github.com/tc39/proposal-observable
interface Observable {
    // Subscribes to the sequence with an observer
    subscribe(observer: Observer): Subscription;

    // Returns itself
    [SymbolObservable](): Observable;

    // Converts items to an Observable
    static of(...items): Observable;

    // Converts an observable or iterable to an Observable
    static from(observable): Observable;
}

interface Subscription {
    // Cancels the subscription
    unsubscribe(): void;

    // A boolean value indicating whether the subscription is closed
    closed: boolean;
}

interface Observer {
    // Receives the subscription object when `subscribe` is called
    start(subscription: Subscription);

    // Receives the next value in the sequence
    next(value);

    // Receives the sequence error
    error(errorValue);

    // Receives a completion notification
    complete();
}
