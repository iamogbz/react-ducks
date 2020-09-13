import { createAction, createReducer } from "src";
import { ActionTypes } from "src/utils/actionTypes";

describe("createReducer", () => {
    const unknownAction = createAction(ActionTypes.PROBE_UNKNOWN_ACTION)();

    it("creates valid reducer with minimal args", () => {
        const actionType = "actionType";
        const initialState = { yes: false };
        const reducer = createReducer(initialState, {
            [actionType]: (state) => ({ ...state, yes: true }),
        } as Record<string, Reducer<typeof initialState, string>>);
        const state1 = reducer(initialState, unknownAction);
        expect(state1).toEqual(initialState);

        const state2 = reducer(state1, createAction(actionType)());
        expect(state2).not.toEqual(state1);
        expect(state2.yes).toBe(true);
    });

    it("uses default reducer when no other action type matches", () => {
        const actionType = "actionType";
        const initialState = { yes: "nothing" };
        const reducer = createReducer(
            initialState,
            {
                [actionType]: (state) => ({ ...state, yes: "something" }),
            } as Record<string, Reducer<typeof initialState, string>>,
            (state) => ({ ...state, yes: "nani!!!" }),
        );
        const state1 = reducer(initialState, unknownAction);
        expect(state1.yes).toEqual("nani!!!");

        const state2 = reducer(state1, createAction(actionType)());
        expect(state2.yes).toBe("something");
    });
});
