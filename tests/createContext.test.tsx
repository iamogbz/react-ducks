import * as React from "react";
import { act, render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { Provider, applyMiddleware, createContext } from "src";

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

    it("passes context value to consumer", () => {
        const initialState = {};
        const reducer = jest.fn((s) => s);
        const Context = createContext(reducer, initialState);
        const { result } = renderHook(() => React.useContext(Context));
        const contextValue = result.current;
        const spyConsume = jest.fn(() => null);
        render(
            <Provider Context={Context}>
                <Context.Consumer>{spyConsume}</Context.Consumer>
            </Provider>,
        );
        expect(spyConsume).toHaveBeenCalledTimes(1);
        const [consumeValue] = (spyConsume.mock.calls[0] as unknown) as [
            ContextValue,
        ];
        expect(consumeValue.enhancer).toBeUndefined();
        expect(consumeValue.getState()).toStrictEqual(contextValue.state);
        expect(reducer).toHaveBeenCalledTimes(1);
        const action = { type: "ACTION_TYPE" };
        act(() => void consumeValue.dispatch(action));
        expect(reducer).toHaveBeenCalledTimes(2);
        expect(reducer).toHaveBeenLastCalledWith(consumeValue.state, action);
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

    it("has expected default context value", () => {
        const Context = createContext((s) => s, {});
        const { result } = renderHook(() => React.useContext(Context));
        expect(result.current).toMatchSnapshot();
        expect(result.current["subscribe"]).toThrow("Unimplemented method");
    });
});
