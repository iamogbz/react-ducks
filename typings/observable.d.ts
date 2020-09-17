// github.com/tc39/proposal-observable
interface SymbolConstructor {
    readonly observable: symbol;
    readonly [key: string]: symbol;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Observable {
    // Subscribes to the sequence with an observer
    subscribe: SubscriberFunction;

    // Subscribes to the sequence with callbacks
    subscribe: SubscriberFunctions;

    // Returns itself
    [Symbol.observable]?(): Observable;

    // Converts items to an Observable
    static of?(...items): Observable;

    // Converts an observable or iterable to an Observable
    static from?(observable): Observable;
}

type SubscriberFunction = (
    observer: SubscriptionObserver,
) => UnsubscriberFunction | Subscription;

type SubscriberFunctions = (
    onNext: OnNextFunction,
    onError?: OnErrorFunction,
    onComplete?: OnCompleteFunction,
) => Subscription;

interface Subscription {
    // Cancels the subscription
    unsubscribe: UnsubscriberFunction;

    // A boolean value indicating whether the subscription is closed
    closed: boolean;
}

type OnNextFunction = (value) => void;
type OnErrorFunction = (errorValue) => void;
type OnCompleteFunction = () => void;

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

type UnsubscriberFunction = () => void;
