import * as React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { Provider, createContext } from "src";
// eslint-disable-next-line jest/no-mocks-import
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

    it("does not allow setting the global context multiple times", () => {
        expect(() => {
            createContext((s) => s, null, undefined, "NewGlobalContext", true);
        }).toThrow("Global context can only be set once");
    });

    it("renders without root provider", async () => {
        const result = render(<Example />);
        expect(result.baseElement).toMatchSnapshot();
        const element = await result.findByText("increment");
        act(() => element.click());
        expect(increment).not.toHaveBeenCalled();
    });

    it("renders with root provider and updates on action dispatch", async () => {
        const result = render(
            <RootProvider>
                <Example />
            </RootProvider>,
        );
        const element = await result.findByText("increment");
        act(() => element.click());
        expect(increment).toHaveBeenCalledWith(0);
        act(() => element.click());
        expect(increment).toHaveBeenCalledWith(1);
        expect(result.baseElement).toMatchSnapshot();
        expect(init).toHaveBeenCalledTimes(1);
    });

    it("renders with enhanced context", async () => {
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
        expect(spyConsoleLog.mock.calls[0]).toMatchObject([
            "action to dispatch",
            {
                payload: undefined,
                type: expect.stringContaining("@@context/INIT"),
            },
        ]);
        expect(spyConsoleLog.mock.calls[1]).toMatchObject([
            "state after dispatch",
            { counter: 0, init: true },
        ]);
        spyConsoleLog.mockRestore();
    });

    it("fails to render if middleware dispatches while constructing", () => {
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
