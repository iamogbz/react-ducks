import { bindActionCreators } from "src/utils/bindActionCreators";

describe("bindActionCreators", () => {
    it("binds action creator function to dispatch", () => {
        const dispatch = jest.fn();
        const action = { payload: "Some payload", type: "ACTION_TYPE" };
        const boundActionCreator = bindActionCreators(() => action, dispatch);
        expect(boundActionCreator()).toBeUndefined();
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(action);
    });

    it("binds action creator mapping to dispatch", () => {
        const dispatch = jest.fn();
        const action = { payload: "Some payload", type: "ACTION_TYPE" };
        const boundActionCreators = bindActionCreators(
            ({
                action1: () => action,
                action2: null,
                action3: undefined,
                action4: "non function",
            } as unknown) as ActionCreatorMapping,
            dispatch,
        );
        expect(boundActionCreators.action1()).toBeUndefined();
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(action);
        expect(boundActionCreators.action2).toBeUndefined();
        expect(boundActionCreators.action3).toBeUndefined();
        expect(boundActionCreators.action4).toBeUndefined();
    });

    it.each`
        actionCreator
        ${"non function"}
        ${null}
        ${undefined}
    `(
        "does not binds unsupported action creator to dispatch",
        ({ actionCreator }) => {
            const dispatch = jest.fn();
            expect(() => bindActionCreators(actionCreator, dispatch)).toThrow(
                "bindActionCreators expected an object or a function",
            );
        },
    );
});
