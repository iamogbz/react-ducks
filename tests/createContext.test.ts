import * as React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { applyMiddleware, createContext } from "src";
import { SymbolObservable } from "src/utils/symbolObservable";

describe("createContext", () => {
    it("creates context without displayname", () => {
        const Context = createContext((s) => s, {});
        expect(Context.displayName).toBeUndefined();
    });

    it("creates context with displayname", () => {
        const Context = createContext((s) => s, {}, undefined, "TextContext");
        expect(Context.displayName).toBe("TextContext");
    });

    it("has default dispatch and getState", () => {
        const initialState = {};
        const Context = createContext((s) => s, initialState);
        const { result } = renderHook(() => React.useContext(Context));
        expect(result.current.dispatch).not.toThrow();
        expect(result.current.enhancer).toBeUndefined();
        expect(result.current.getState()).toStrictEqual(initialState);
    });

    it("provides and can use empty enhancer from applyMiddleware", () => {
        const initialState = {};
        const Context = createContext(
            (s) => s,
            initialState,
            applyMiddleware(),
        );
        const { result } = renderHook(() => React.useContext(Context));
        const { enhancer, ...value } = result.current;
        expect(enhancer?.(value)).toMatchObject(value);
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
