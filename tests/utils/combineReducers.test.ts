import { combineReducers } from "src/utils/combineReducers";

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
            sliceA: (s, a: Action) => s + String(a?.payload ?? ""),
            sliceB: (s, a: Action) => !!a?.payload,
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
