export function bindActionCreator<T extends string, P>(
    actionCreator: Nullable<ActionCreator<T, P>>,
    dispatch: ContextDispatch<T, P>,
): Nullable<ActionDispatcher<P>> {
    if (typeof actionCreator !== "function") return;
    return function dispatchAction(...args: P[]): void {
        dispatch(actionCreator(...args));
    };
}
