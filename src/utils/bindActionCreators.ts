// github.com/reduxjs/redux/blob/208d7f1/src/bindActionCreators.ts

export function bindActionCreator<T extends string, P>(
    actionCreator: Nullable<ActionCreator<T, P>>,
    dispatch: ContextDispatch<T, P>,
): Nullable<ActionDispatcher<P>> {
    if (typeof actionCreator !== "function") return;
    return function dispatchAction(...args: P[]): void {
        dispatch(actionCreator(...args));
    };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly.
 */
export function bindActionCreators<T extends string, P>(
    actionCreator: Nullable<ActionCreator<T, P>>,
    dispatch: ContextDispatch<T, P>,
): ActionDispatcher<P>;

export function bindActionCreators<T extends string, P, S>(
    actionCreators: Nullable<ActionCreatorMapping<T, P, S>>,
    dispatch: ContextDispatch<T, P>,
): ActionDispatcherMapping<T, P>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function bindActionCreators(
    actionCreators: Nullable<ActionCreator | ActionCreatorMapping>,
    dispatch: ContextDispatch,
) {
    if (typeof actionCreators === "function") {
        return bindActionCreator(actionCreators, dispatch);
    }

    if (typeof actionCreators !== "object" || actionCreators === null) {
        throw new Error(
            `bindActionCreators expected an object or a function, instead received ${
                actionCreators === null ? "null" : typeof actionCreators
            }. ` +
                'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?',
        );
    }

    const boundActionCreators: ActionDispatcherMapping = {};
    for (const key in actionCreators) {
        const bound = bindActionCreator(actionCreators[key], dispatch);
        if (bound) {
            boundActionCreators[key] = bound;
        }
    }
    return boundActionCreators;
}
