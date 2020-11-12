import * as React from "react";
import { isFunction } from "../utils/isFunction";

const NOOP = () => undefined;

function useCollection<K, V>(
    initial: Map<K, V>,
): {
    value: Map<K, V>;
    add: (...items: [K, V][]) => void;
    remove: (...items: K[]) => void;
} {
    const [value, setValue] = React.useState(initial);

    const add = React.useCallback(function add(...items: [K, V][]) {
        setValue((m) => items.reduce((c, [k, v]) => m.set(k, v), m));
    }, []);

    const remove = React.useCallback(function remove(...keys: K[]) {
        setValue((m) => {
            keys.forEach((key) => m.delete(key));
            return m;
        });
    }, []);

    return { add, remove, value };
}

const asObserver = (
    next: OnNextFunction,
    error: OnErrorFunction = NOOP,
    complete: OnCompleteFunction = NOOP,
): Observer => ({
    complete,
    error,
    next,
    start: NOOP,
});

export function useObservable<V>(value: V): [V & Observable, () => void] {
    type Key = Observer | OnNextFunction;

    const { value: observers, add, remove } = useCollection(
        new Map<Key, Observer>(),
    );

    const subscribe = React.useCallback(
        function subscribe(
            listenerOrObserver: Key,
            ...args: [OnErrorFunction?, OnCompleteFunction?]
        ) {
            const observer = isFunction<OnNextFunction>(listenerOrObserver)
                ? asObserver(listenerOrObserver, ...args)
                : listenerOrObserver;

            let closed = false;
            const subscription: Subscription = {
                get closed() {
                    return closed;
                },
                unsubscribe() {
                    if (closed) return;
                    remove(listenerOrObserver);
                    observer.complete();
                    closed = true;
                },
            };

            try {
                add([listenerOrObserver, observer]);
                observer.start(subscription);
            } catch (e) {
                observer.error(e);
                subscription.unsubscribe();
            }
            return subscription;
        },
        [add, remove],
    );

    const observable = React.useMemo(
        function getObservable() {
            return {
                subscribe,
                [Symbol.observable]() {
                    return this;
                },
            } as Observable;
        },
        [subscribe],
    );

    const nextValue = React.useMemo(
        function getNextValue() {
            return { ...value, ...observable };
        },
        [observable, value],
    );

    const observeNext = React.useCallback(
        function observeNext() {
            observers.forEach((observer) => observer.next(nextValue));
        },
        [observers, nextValue],
    );

    return [nextValue, observeNext];
}
