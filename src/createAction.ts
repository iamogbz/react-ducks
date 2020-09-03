export function createAction<ActionType extends string, PayloadType>(
    type: ActionType,
    prepare = (
        payload: PayloadType,
    ): Partial<Action<ActionType, PayloadType>> => ({ payload }),
): ActionCreator<ActionType, PayloadType> {
    return (payload): Action<ActionType, PayloadType> => {
        const partialAction = prepare(payload);
        return { ...partialAction, type };
    };
}
