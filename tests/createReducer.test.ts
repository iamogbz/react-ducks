import { createAction, createReducer } from "src";

describe("createReducer", () => {
    it("creates valid reducer with minimal args", () => {
        const actionType = "actionType";
        const initialState = { yes: false };
        const reducer = createReducer(initialState, {
            [actionType]: (state) => ({ ...state, yes: true }),
        });
        const state1 = reducer(initialState, createAction("doNotHandle")());
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
            },
            undefined,
            (state) => ({ ...state, yes: "nani!!!" }),
        );
        const state1 = reducer(initialState, createAction("doNotHandle")());
        expect(state1.yes).toEqual("nani!!!");

        const state2 = reducer(state1, createAction(actionType)());
        expect(state2.yes).toBe("something");
    });

    it("correctly maps reducer actions", () => {
        const actionType = "actionType";
        const mappedActionType = "mappedActionType";
        const unmappedActionType = "unmappedActionType";
        const initialState = { yes: false, no: false };
        const reducer = createReducer(
            initialState,
            {
                [actionType]: (state) => ({ ...state, yes: true }),
                [unmappedActionType]: (state) => ({ ...state, no: true }),
            },
            { [mappedActionType]: actionType },
        );
        const state1 = reducer(initialState, createAction("doNotHandle")());
        expect(state1).toEqual(initialState);

        const state2 = reducer(state1, createAction(mappedActionType)());
        expect(state2.yes).toBe(true);
        expect(state2.no).toBe(false);

        const state3 = reducer(state2, createAction(unmappedActionType)());
        expect(state3.yes).toBe(true);
        expect(state3.no).toBe(true);
    });
});
