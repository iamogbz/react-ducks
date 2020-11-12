import { createAction, createReducer } from "src";
import { ActionTypes } from "src/utils/actionTypes";

describe("createReducer", () => {
    const unknownAction = createAction(ActionTypes.PROBE_UNKNOWN_ACTION)();

    it("creates valid reducer with minimal args", () => {
        const actionType = "actionType";
        const initialState = { yes: false };
        const reducer = createReducer(initialState, {
            [actionType]: (state) => ({ ...state, yes: true }),
        });
        const state1 = reducer(initialState, unknownAction);
        expect(state1).toStrictEqual(initialState);

        const state2 = reducer(state1, createAction(actionType)());
        expect(state2).not.toStrictEqual(state1);
        expect(state2.yes).toBe(true);
    });

    it("is a noop identity function when no arguments are passed", () => {
        const initialState = { noop: "please" };
        const reducer = createReducer(initialState, {
            actionType: (state) => ({ ...state, hmm: "say what!" }),
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(reducer()).toBe(initialState);
    });

    it("is a noop identity function when no action is passed", () => {
        const initialState = { noop: "please" };
        const reducer = createReducer(initialState, {
            actionType: (state) => ({ ...state, hmm: "say what!" }),
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(reducer(initialState)).toBe(initialState);
    });

    it("uses default reducer when no other action type matches", () => {
        const actionType = "actionType";
        const initialState = { yes: "nothing" };
        const reducer = createReducer(
            initialState,
            {
                [actionType]: (state) => ({ ...state, yes: "something" }),
            },
            (state) => ({ ...state, yes: "nani!!!" }),
        );
        const state1 = reducer(initialState, unknownAction);
        expect(state1.yes).toBe("nani!!!");

        const state2 = reducer(state1, createAction(actionType)());
        expect(state2.yes).toBe("something");
    });
});
