import * as React from "react";
import { RenderResult, act, cleanup, render } from "@testing-library/react";
import {
    GlobalContext,
    Provider,
    applyMiddleware,
    createContext,
    createDuck,
    createRootDuck,
    createRootProvider,
    useDispatch,
    useSelector,
} from "src";
import { ActionTypes } from "src/utils/actionTypes";

describe("provider", () => {
    const DECREMENT = "decrement";
    const INCREMENT = "increment";
    const decrement = (state: number) => state - 1;
    const increment = jest.fn((state: number) => state + 1);
    const counterReducer: (s: number, a?: Action<string>) => number = (
        state,
        action,
    ) => {
        switch (action?.type) {
            case DECREMENT:
                return decrement(state);
            case INCREMENT:
                return increment(state);
            default:
                return state;
        }
    };
    const counterDuck = createDuck({
        initialState: 0,
        name: "counter",
        reducers: { [DECREMENT]: counterReducer, [INCREMENT]: counterReducer },
        selectors: { get: (s) => s["counter"] },
    });

    const ACTION_TYPE_INIT = "init";
    const init = jest.fn(() => true);
    const initDuck = createDuck({
        actionMapping: { [ActionTypes.INIT]: ACTION_TYPE_INIT },
        initialState: false,
        name: "init",
        reducers: { [ACTION_TYPE_INIT]: init },
    });

    const dummyDuck = createDuck({
        initialState: null,
        name: "dummy",
        reducers: {},
    });

    const rootDuck = createRootDuck(counterDuck, initDuck, dummyDuck);

    const dummyMiddleware: Middleware<
        typeof rootDuck.initialState,
        ContextDispatch<Action>
    > = () => (next) => (action) => next(action);

    const Context = createContext(
        rootDuck.reducer,
        rootDuck.initialState,
        applyMiddleware(dummyMiddleware),
        "GlobalContext",
        true,
    );

    const RootProvider = createRootProvider(Context);

    function Example() {
        const increment = useDispatch(counterDuck.actions.increment);
        const init = useSelector(rootDuck.selectors.init!.$, Context);
        const count = useSelector(counterDuck.selectors?.get);
        return (
            <div>
                Count: <span>{count}</span>
                <button disabled={!init} onClick={increment}>
                    increment
                </button>
            </div>
        );
    }

    afterEach(() => {
        increment.mockClear();
        init.mockClear();
        jest.clearAllMocks();
        cleanup();
    });

    describe("context", () => {
        it("renders without root provider", async () => {
            const result = render(<Example />);
            // eslint-disable-next-line jest/prefer-snapshot-hint
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
            // eslint-disable-next-line jest/prefer-snapshot-hint
            expect(result.baseElement).toMatchSnapshot();
            expect(init).toHaveBeenCalledTimes(1);
        });

        it("renders with enhanced context", async () => {
            const loggerMiddleware: Middleware<
                typeof rootDuck.initialState,
                ContextDispatch<Action>
            > =
                ({ getState }) =>
                (next) =>
                async (action) => {
                    // eslint-disable-next-line no-console
                    console.log("action to dispatch", action);
                    // Call the next dispatch method in the middleware chain.
                    const returnValue = await next(action);
                    // eslint-disable-next-line no-console
                    console.log("state after dispatch", getState());
                    // This will likely be the action itself, unless
                    // a middleware further in chain changed it.
                    return returnValue;
                };
            const EnhancedContext = createContext(
                rootDuck.reducer,
                rootDuck.initialState,
                applyMiddleware(dummyMiddleware, loggerMiddleware),
                "EnhancedContext",
            );

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
            const badMiddleware: Middleware<
                typeof rootDuck.initialState,
                ContextDispatch<Action>
            > = ({ dispatch }) => {
                dispatch({ type: "SOME_ACTION" });
                return () => async (action) => action;
            };
            const emptyRootDuck = createRootDuck();
            const ErrorContext = createContext(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                emptyRootDuck.reducer as Reducer<any, Action>,
                emptyRootDuck.initialState,
                applyMiddleware(dummyMiddleware, badMiddleware),
                "ErrorContext",
            );
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

    describe("observable", () => {
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
                const init = useSelector(rootDuck.selectors.init!.$);
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
                const init = useSelector(rootDuck.selectors.init!.$, Context);
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
