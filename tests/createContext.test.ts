import * as React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { createContext } from "src";
import { SymbolObservable } from "src/utils/symbolObservable";

describe("createContext", () => {
    it("creates context without displayname", () => {
        const Context = createContext((s) => s, {});
        expect(Context.displayName).toBeUndefined;
    });

    it("creates context with displayname", () => {
        const Context = createContext((s) => s, {}, undefined, "TextContext");
        expect(Context.displayName).toEqual("TextContext");
    });

    it("has unimplemented observable symbol", () => {
        const Context = createContext((s) => s, {});
        const { result } = renderHook(() => React.useContext(Context));
        expect(result.current).toMatchSnapshot();
        expect(
            ((result.current as unknown) as Record<string, unknown>)[
                (SymbolObservable as unknown) as string
            ],
        ).toThrow("Unimplemented method");
    });
});
