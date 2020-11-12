import { createAction } from "src";
import { bindActionCreator } from "src/utils/bindActionCreators";
import { combineReducers } from "src/utils/combineReducers";

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

describe("combineReducers", () => {
    it("calls all reducers", () => {
        const initialState = { reducerA: "a", reducerB: "b" };
        const reducerA = jest.fn((s) => s);
        const reducerB = jest.fn((s) => s);
        const reducer = combineReducers(initialState, { reducerA, reducerB });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reducer();
        expect(reducerA).toHaveBeenLastCalledWith(
            initialState.reducerA,
            undefined,
        );
        expect(reducerB).toHaveBeenLastCalledWith(
            initialState.reducerB,
            undefined,
        );
        const state = { reducerA: "AAA", reducerB: "BBB" };
        const action = { type: "action" };
        reducer(state, action);
        expect(reducerA).toHaveBeenLastCalledWith(state.reducerA, action);
        expect(reducerB).toHaveBeenLastCalledWith(state.reducerB, action);
    });

    it("creates a root reducer", () => {
        const state = {
            sliceA: "a",
            sliceB: true,
        };
        const reducer = combineReducers(state, {
            sliceA: (s, a: Action<string, unknown>) =>
                s + String(a?.payload ?? ""),
            sliceB: (s, a: Action<string, unknown>) => !!a?.payload,
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(reducer()).toMatchObject({
            sliceA: "a",
            sliceB: false,
        });
        expect(reducer(state, { payload: true, type: "action" })).toMatchObject(
            {
                sliceA: "atrue",
                sliceB: true,
            },
        );
    });
});
