import * as React from "react";
import { isFunction } from "../utils/isFunction";

const NOOP = () => undefined;

function useCollection<K, V>(
    initial: Map<K, V> = new Map<K, V>(),
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

export function useObservable<V>(getter: () => V): V & Observable {
    type Key = Observer | OnNextFunction;

    const { value: observers, add, remove } = useCollection<Key, Observer>();

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

    const value = getter();

    const nextValue = React.useMemo(
        function getNextValue() {
            return { ...value, ...observable };
        },
        [observable, value],
    );

    const next = React.useCallback(
        function next() {
            observers.forEach((observer) => {
                observer.next(nextValue);
            });
        },
        [observers, nextValue],
    );

    // Only call observers next for a value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(next, [nextValue]);

    return nextValue;
}
