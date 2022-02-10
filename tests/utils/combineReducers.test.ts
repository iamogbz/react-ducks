import { combineReducers } from "src/utils/combineReducers";

describe("combineReducers", () => {
    it("calls all reducers", () => {
        const initialState = { reducerA: "a", reducerB: "b" };
        const reducerA = jest.fn((s, _) => s);
        const reducerB = jest.fn((s, _) => s);
        const reducer = combineReducers(initialState, { reducerA, reducerB });
        // @ts-expect-error 2 arguments needed for reducer
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
            sliceA: (s, a) => s + String(a?.payload),
            sliceB: (s, a) => !!a?.payload,
        });
        // @ts-expect-error 2 arguments needed for reducer
        expect(reducer()).toMatchInlineSnapshot(`
      Object {
        "sliceA": "aundefined",
        "sliceB": false,
      }
    `);
        expect(reducer(state, { payload: true, type: "action" }))
            .toMatchInlineSnapshot(`
      Object {
        "sliceA": "atrue",
        "sliceB": true,
      }
    `);
    });
});
