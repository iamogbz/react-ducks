import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useSelector } from "src";
import { createContextWithValue } from "src/createContext";

describe("useSelector", () => {
    const createContext = (props?: Record<string, unknown>) =>
        createContextWithValue({
            dispatch: async (a: Action<string, string>) => a,
            reducer: (s) => s,
            state: "infinite",
            subscribe: () => ({ closed: true, unsubscribe: () => undefined }),
            ...props,
        });

    it("calls selector once for same arguments", () => {
        const selector = jest.fn((s) => s);
        const { result, rerender } = renderHook(
            (context) => useSelector(selector, context),
            { initialProps: createContext() },
        );
        expect(result.current).toBe("infinite");
        expect(selector).toHaveBeenCalledTimes(1);
        act(rerender);
        expect(result.current).toBe("infinite");
        expect(selector).toHaveBeenCalledTimes(1);
        act(() => rerender(createContext({ state: "finite" })));
        expect(result.current).toBe("finite");
        expect(selector).toHaveBeenCalledTimes(2);
    });
});
