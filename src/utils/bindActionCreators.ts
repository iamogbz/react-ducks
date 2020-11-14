export function bindActionCreator<T extends Action>(
    actionCreator: DuckActionCreators<T>,
    dispatch: ContextDispatch<T>,
): ActionDispatcher<T> {
    if (typeof actionCreator !== "function")
        throw new Error(
            `Can not bind dispatch to action creator: ${actionCreator}`,
        );
    return function dispatchAction(arg): void {
        dispatch(actionCreator(arg));
    };
}
