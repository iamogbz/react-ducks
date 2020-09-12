import * as React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { Provider } from "src";
import { createMocks } from "./mocks";

describe("e2e", (): void => {
    const {
        EnhancedContext,
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
        const spyLog = jest.spyOn(console, "log");
        render(
            <Provider Context={EnhancedContext}>
                <Example />
            </Provider>,
        );
        await Promise.resolve();
        expect(spyLog).toHaveBeenCalledTimes(2);
        expect(spyLog.mock.calls[0]).toEqual([
            "action to dispatch",
            {
                payload: undefined,
                type: expect.stringContaining("@@context/INIT"),
            },
        ]);
        expect(spyLog.mock.calls[1]).toEqual([
            "state after dispatch",
            { counter: 0, init: true },
        ]);
        spyLog.mockRestore();
    });
});
