import * as React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { Provider, createContext } from "src";
import { createMocks } from "./__mocks__";

describe("e2e", (): void => {
    const {
        EnhancedContext,
        ErrorContext,
        Example,
        RootProvider,
        increment,
        init,
    } = createMocks();

    afterEach(() => {
        increment.mockClear();
        init.mockClear();
        jest.clearAllMocks();
        cleanup();
    });

    it("Does not allow setting the global context multiple times", () => {
        expect(() => {
            createContext((s) => s, null, undefined, "NewGlobalContext", true);
        }).toThrow("Global context can only be set once");
    });

    it("Renders without root provider", async () => {
        const result = render(<Example />);
        expect(result.baseElement).toMatchSnapshot();
        await act(() =>
            result.findByText("increment").then((element) => element.click()),
        );
        expect(increment).not.toHaveBeenCalled();
    });

    it("Renders with root provider and updates on action dispatch", async () => {
        const result = render(
            <RootProvider>
                <Example />
            </RootProvider>,
        );
        await act(() => result.findByText("increment").then((e) => e.click()));
        expect(increment).toHaveBeenCalled();
        await act(() => result.findByText("increment").then((e) => e.click()));
        expect(result.baseElement).toMatchSnapshot();
        expect(init).toHaveBeenCalledTimes(1);
    });

    it("Renders with enhanced context", async () => {
        const spyConsoleLog = jest
            .spyOn(console, "log")
            .mockImplementation(() => undefined);
        render(
            <Provider Context={EnhancedContext}>
                <Example />
            </Provider>,
        );
        await Promise.resolve();
        expect(spyConsoleLog).toHaveBeenCalledTimes(2);
        expect(spyConsoleLog.mock.calls[0]).toEqual([
            "action to dispatch",
            {
                payload: undefined,
                type: expect.stringContaining("@@context/INIT"),
            },
        ]);
        expect(spyConsoleLog.mock.calls[1]).toEqual([
            "state after dispatch",
            { counter: 0, init: true },
        ]);
        spyConsoleLog.mockRestore();
    });

    it("Fails to render if middleware dispatches while constructing", () => {
        const spyConsoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => undefined);
        expect(() =>
            render(
                <Provider Context={ErrorContext}>
                    <Example />
                </Provider>,
            ),
        ).toThrow(
            "Dispatching while constructing your middleware is not allowed",
        );
        spyConsoleError.mockRestore();
    });
});
