import * as React from "react";
import { RenderResult, act, cleanup, render } from "@testing-library/react";
import {
    GlobalContext,
    Provider,
    createContext,
    useDispatch,
    useSelector,
} from "src";
import { createMocks } from "./index.mock";

describe("integration", () => {
    const {
        EnhancedContext,
        ErrorContext,
        Example,
        RootProvider,
        increment,
        init,
        rootDuck,
    } = createMocks();

    afterEach(() => {
        increment.mockClear();
        init.mockClear();
        jest.clearAllMocks();
        cleanup();
    });

    describe("createContext", () => {
        it("does not allow setting the global context multiple times", () => {
            expect(() => {
                createContext(
                    (s) => s,
                    null,
                    undefined,
                    "NewGlobalContext",
                    true,
                );
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

    describe("contextSubscribe", () => {
        async function runAssertions(
            result: RenderResult,
            listener: jest.Mock,
        ) {
            expect(listener).toHaveBeenCalledTimes(2);
            const button = await result.findByText("increment");
            act(() => button.click());
            expect(listener).toHaveBeenCalledTimes(3);
            act(() => button.click());
            expect(listener).toHaveBeenCalledTimes(4);
            expect(listener).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    dispatch: expect.any(Function),
                    getState: expect.any(Function),
                    reducer: expect.any(Function),
                    state: {
                        counter: 2,
                        dummy: null,
                        init: true,
                    },
                    subscribe: expect.any(Function),
                }),
            );
            const [[lastCallArg0]] = listener.mock.calls.slice(-1);
            expect(lastCallArg0[Symbol.observable]()).toBe(lastCallArg0);
        }

        it("subscribes successfully to context value changes from component", async () => {
            expect.assertions(5);
            const listener = jest.fn();
            function Sample() {
                const value = React.useContext(GlobalContext);
                React.useEffect(
                    function contextSubscribe() {
                        value.subscribe(listener);
                    },
                    [value],
                );
                const increment = useDispatch(
                    rootDuck.actions.counter.increment,
                );
                const init = useSelector(rootDuck.selectors.init?.$);
                return (
                    <div>
                        <button disabled={!init} onClick={increment}>
                            increment
                        </button>
                    </div>
                );
            }
            const result = render(
                <RootProvider>
                    <Sample />
                </RootProvider>,
            );
            await runAssertions(result, listener);
        });

        it("subscribes successfully to context value changes from enhancer", async () => {
            expect.assertions(6);
            const listener = jest.fn();
            const supplement = { extra: "value" };
            const enhancer = jest.fn(function enhancer(value) {
                value.subscribe(listener);
                return { ...value, ...supplement };
            });
            const Context = createContext(
                rootDuck.reducer,
                rootDuck.initialState,
                enhancer,
            );
            function Sample() {
                const increment = useDispatch(
                    rootDuck.actions.counter.increment,
                    Context,
                );
                const init = useSelector(rootDuck.selectors.init?.$, Context);
                return (
                    <div>
                        <button disabled={!init} onClick={increment}>
                            increment
                        </button>
                    </div>
                );
            }
            const result = render(
                <Provider Context={Context}>
                    <Sample />
                </Provider>,
            );
            await runAssertions(result, listener);
            expect(listener).toHaveBeenLastCalledWith(
                expect.objectContaining(supplement),
            );
        });
    });
});
