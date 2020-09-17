import { renderHook } from "@testing-library/react-hooks";
import { useDispatch } from "src";
import { createContextWithValue } from "src/createContext";

describe("useDispatch", () => {
    const mockValue = {
        dispatch: async (a: Action<string, string>): Promise<typeof a> => a,
        state: null,
        reducer: (): null => null,
    };

    it("uses dispatch from Context", () => {
        const dispatch = jest.fn(mockValue.dispatch);
        const context = createContextWithValue({ ...mockValue, dispatch });
        const ACTION_TYPE = "ACTION_TYPE" as const;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const actionCreator = (payload?: string) => ({
            type: ACTION_TYPE,
            payload,
        });
        const { result } = renderHook(() =>
            useDispatch(actionCreator, context),
        );
        const arg0 = "Some argument";
        result.current(arg0);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
            type: ACTION_TYPE,
            payload: arg0,
        });
    });

    it.each`
        actionCreator
        ${"non function"}
        ${null}
        ${undefined}
    `("fails to use dispatch with actionCreator", ({ actionCreator }) => {
        const context = createContextWithValue(mockValue);
        const { result } = renderHook(() =>
            useDispatch(actionCreator, context),
        );
        expect(() => result.current).toThrow("Unable to bind action creator");
    });
});
