export function createAction<T extends string, P, S>(
    type: T,
    prepare = (payload?: P): Partial<Action<T, P>> => ({ payload }),
): ActionCreator<T, P, S> {
    return function createAction(payload): Action<T, P> {
        const partialAction = prepare(payload);
        return { ...partialAction, type };
    };
}
