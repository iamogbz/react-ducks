import { createAction } from "src";
import { bindActionCreator } from "src/utils/bindActionCreators";

describe("bindActionCreators", () => {
    it("binds action creator function to dispatch", () => {
        const dispatch = jest.fn();
        const action = { payload: "Some payload", type: "ACTION_TYPE" };
        const boundActionCreator = bindActionCreator(
            createAction(action.type, () => action),
            dispatch,
        );
        expect(boundActionCreator!()).toBeUndefined();
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(action);
    });
});
