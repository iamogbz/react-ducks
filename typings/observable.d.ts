// github.com/tc39/proposal-observable
interface SymbolConstructor {
    readonly observable: symbol;
    readonly [key: string]: symbol;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Observable {
    new (subscriber: SubscriberFunction);

    // Subscribes to the sequence with an observer
    subscribe(observer: Observer): Subscription;

    // Subscribes to the sequence with callbacks
    subscribe(
        onNext: OnNextFunction,
        onError?: OnErrorFunction,
        onComplete?: OnCompleteFunction,
    ): Subscription;

    // Returns itself
    [Symbol.observable](): Observable;

    // Converts items to an Observable
    of(...items): Observable;

    // Converts an observable or iterable to an Observable
    from(observable): Observable;
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

interface Subscription {
    // Cancels the subscription
    unsubscribe: UnsubscribeFunction;

    // A boolean value indicating whether the subscription is closed
    closed: boolean;
}

type SubscriberFunction = (
    observer: SubscriptionObserver,
) => UnsubscribeFunction | Subscription;

type OnNextFunction = (value) => void;
type OnErrorFunction = (errorValue) => void;
type OnCompleteFunction = () => void;
type UnsubscribeFunction = () => void;

interface SubscriptionObserver {
    // Sends the next value in the sequence
    next: OnNextFunction;

    // Sends the sequence error
    error: OnErrorFunction;

    // Sends the completion notification
    complete: OnCompleteFunction;

    // A boolean value indicating whether the subscription is closed
    closed: boolean;
}
