export function createAction<T extends string, P, S>(
    type: T,
    prepare = (payload?: P): Partial<Action<T, P>> => ({ payload }),
): ActionCreator<T, P, S> {
    return Object.assign(
        function createAction(payload) {
            const partialAction = prepare(payload);
            return { ...partialAction, type };
        } as ActionCreator<T, P, S>,
        { type },
    );
}
