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
        const state1 = reducer(initialState, unknownAction);
        expect(state1.yes).toEqual("nani!!!");

        const state2 = reducer(state1, createAction(actionType)());
        expect(state2.yes).toBe("something");
    });

    it("correctly maps reducer actions", () => {
        const actionType = "actionType";
        const mappedActionType = "mappedActionType";
        const unmappedActionType = "unmappedActionType";
        const initialState = { yes: false, no: false };
        const actionTypeReducer = jest.fn((state) => ({ ...state, yes: true }));
        const unMappedActionTypeReducer = jest.fn((state) => ({
            ...state,
            no: true,
        }));
        const reducer = createReducer(
            initialState,
            {
                [actionType]: actionTypeReducer,
                [unmappedActionType]: unMappedActionTypeReducer,
            },
            { [mappedActionType]: actionType },
        );
        const state1 = reducer(initialState, unknownAction);
        expect(state1).toEqual(initialState);

        const state2 = reducer(state1, createAction(mappedActionType)());
        expect(actionTypeReducer).toHaveBeenLastCalledWith(
            state1,
            createAction(actionType)(),
        );
        expect(state2.yes).toBe(true);
        expect(state2.no).toBe(false);

        const unmappedAction = createAction(unmappedActionType)();
        const state3 = reducer(state2, unmappedAction);
        expect(unMappedActionTypeReducer).toHaveBeenLastCalledWith(
            state2,
            unmappedAction,
        );
        expect(state3.yes).toBe(true);
        expect(state3.no).toBe(true);

        expect(actionTypeReducer).toHaveBeenCalledTimes(1);
        expect(unMappedActionTypeReducer).toHaveBeenCalledTimes(1);
    });
});
