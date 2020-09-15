import { renderHook } from "@testing-library/react-hooks";
import { useDispatch } from "src";
import { createContextWithValue } from "src/createContext";

describe("useDispatch", () => {
    it("uses dispatch from Context", () => {
        const dispatch = jest.fn();
        const context = createContextWithValue<unknown, string, string>({
            dispatch,
        });
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
        const dispatch = jest.fn();
        const context = createContextWithValue<unknown, string, string>({
            dispatch,
        });
        const { result } = renderHook(() =>
            useDispatch(actionCreator, context),
        );
        expect(() => result.current).toThrow("Unable to bind action creator");
    });
});
