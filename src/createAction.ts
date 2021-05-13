export function createAction<
    Type extends string = string,
    Payload = unknown,
    State = unknown,
>(
    type: Type,
    prepare = (payload?: Payload): Partial<Action<Type, Payload>> => ({
        payload,
    }),
): ActionCreator<Type, Payload, State> {
    return function createAction(payload?: Payload) {
        const partialAction = prepare(payload);
        return { ...partialAction, type };
    };
}
