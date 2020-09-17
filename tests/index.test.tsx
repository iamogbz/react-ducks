import * as React from "react";
import { createStructuredSelector } from "reselect";
import { act, cleanup, render } from "@testing-library/react";
import {
    GlobalContext,
    Provider,
    createConnect,
    createContext,
    useDispatch,
    useSelector,
} from "src";
import { bindActionCreators } from "src/utils/bindActionCreators";
import { connect } from "src/utils/connect";
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

    describe("createConnect", () => {
        const mapStateToProps = createStructuredSelector({
            count: rootDuck.selectors.counter?.get ?? (() => 0),
            isInitialised: rootDuck.selectors.init?.get ?? (() => false),
        });
        const mapDispatchToProps = {
            increment: rootDuck.actions.counter.increment,
            init: null,
        };
        const staticMergeProps = <A, B, C, D>(
            stateProps: A,
            dispatchProps: B,
            ownProps: C,
        ): D =>
            (({
                ...ownProps,
                ...stateProps,
                ...dispatchProps,
                count: "Replaces count with a static value",
            } as unknown) as D);
        const connectGlobal = createConnect();
        const connectEnhanced = createConnect(EnhancedContext);

        type Props = {
            count: number;
            isInitialised: boolean;
            increment: ActionDispatcher<never>;
        };
        function DumbComponent(props: Props): React.ReactElement {
            return (
                <div>
                    Count: <span>{props.count}</span>
                    <button
                        disabled={!props.isInitialised}
                        onClick={props.increment}
                    >
                        increment
                    </button>
                </div>
            );
        }

        it("works with no connection arguments supplied", () => {
            const ConnectedComponent = connect()((props) => (
                <DumbComponent {...props} />
            ));
            const result = render(
                <RootProvider>
                    <ConnectedComponent />
                </RootProvider>,
            );
            expect(ConnectedComponent.displayName).toBe("Connect(Component)");
            expect(result.baseElement).toMatchSnapshot();
        });

        it("correctly connects state and dispatch to props", async () => {
            const ConnectedComponent = connect(
                mapStateToProps,
                (dispatch: ContextDispatch) =>
                    bindActionCreators(mapDispatchToProps, dispatch),
            )(DumbComponent);
            expect(ConnectedComponent.WrappedComponent).toBe(DumbComponent);
            const result = render(
                <RootProvider>
                    <ConnectedComponent />
                </RootProvider>,
            );
            const element = await result.findByText("increment");
            act(() => element.click());
            act(() => element.click());
            expect(increment).toHaveBeenCalledTimes(2);
            expect(increment).toHaveBeenLastCalledWith(1);
            expect(result.baseElement).toMatchSnapshot();
        });

        it("correctly connects action creators to props", async () => {
            const spyConsoleLog = jest
                .spyOn(console, "log")
                .mockImplementation(() => undefined);
            const ConnectedComponent = connectEnhanced(
                mapStateToProps,
                mapDispatchToProps,
                undefined,
                { pure: true },
            )(DumbComponent);
            const result = render(
                <Provider Context={EnhancedContext}>
                    <ConnectedComponent />
                </Provider>,
            );
            const element = await result.findByText("increment");
            act(() => element.click());
            act(() => element.click());
            await Promise.resolve();
            expect(increment).toHaveBeenCalledTimes(2);
            expect(increment).toHaveBeenLastCalledWith(1);
            expect(result.baseElement).toMatchSnapshot();
            spyConsoleLog.mockRestore();
        });

        it("correctly uses mergeProps function", async () => {
            const ConnectedComponent = connectGlobal(
                mapStateToProps,
                mapDispatchToProps,
                staticMergeProps,
            )(DumbComponent);
            const result = render(
                <RootProvider>
                    <ConnectedComponent />
                </RootProvider>,
            );
            expect(result.baseElement).toMatchSnapshot();
        });

        it.each`
            pure
            ${true}
            ${false}
        `(
            "only rerenders wrapped component when merged props changes if pure($pure)",
            async ({ pure }) => {
                const MockComponent = jest.fn(DumbComponent);
                const ConnectedComponent = connectGlobal(
                    mapStateToProps,
                    (dispatch) => ({
                        increment: bindActionCreators(
                            rootDuck.actions.counter.increment,
                            dispatch,
                        ),
                    }),
                    staticMergeProps,
                    { pure },
                )(MockComponent);
                expect(ConnectedComponent.WrappedComponent).toBe(MockComponent);
                const result = render(
                    <RootProvider>
                        <ConnectedComponent />
                    </RootProvider>,
                );
                const numberOfRenders = MockComponent.mock.calls.length;
                const element = await result.findByText("increment");
                act(() => element.click());
                // When pure is true the number of renders should not have changed
                expect(MockComponent).toHaveBeenCalledTimes(
                    numberOfRenders + Number(!pure),
                );
            },
        );

        it("forwards ref to wrapped component", async () => {
            class ClassComponent extends React.PureComponent {
                render() {
                    return <div></div>;
                }
            }
            const ConnectedComponent = connectGlobal(
                mapStateToProps,
                mapDispatchToProps,
                undefined,
                { forwardRef: true },
            )(ClassComponent);
            expect(ConnectedComponent.WrappedComponent).toBe(ClassComponent);
            const ref = React.createRef<React.ReactElement>();
            render(
                <RootProvider>
                    <ConnectedComponent ref={ref} />
                </RootProvider>,
            );
            expect(ref.current).toBeDefined();
            expect(ref.current).not.toBeNull();
        });

        it("does not forwards ref to wrapped component", () => {
            const spyConsoleError = jest
                .spyOn(console, "error")
                .mockImplementationOnce(() => undefined);
            class ClassComponent extends React.PureComponent {
                render() {
                    return <div></div>;
                }
            }
            const ConnectedComponent = connectGlobal(
                mapStateToProps,
                mapDispatchToProps,
                undefined,
                { forwardRef: false },
            )(ClassComponent);
            const ref = React.createRef<React.ReactElement>();
            render(
                <RootProvider>
                    <ConnectedComponent ref={ref} />
                </RootProvider>,
            );
            expect(ref.current).toBeNull();

            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(spyConsoleError.mock.calls[0][0]).toStrictEqual(
                expect.stringContaining(
                    "Warning: Function components cannot be given refs",
                ),
            );
            spyConsoleError.mockRestore();
        });
    });

    describe("contextSubscribe", () => {
        const listener = jest.fn();
        function Sample() {
            const value = React.useContext(GlobalContext);
            React.useEffect(
                function contextSubscribe() {
                    value.subscribe(listener);
                },
                [value],
            );
            const increment = useDispatch(rootDuck.actions.counter.increment);
            const init = useSelector(rootDuck.selectors.init?.get);
            return (
                <div>
                    <button disabled={!init} onClick={increment}>
                        increment
                    </button>
                </div>
            );
        }

        afterEach(listener.mockClear);

        it("subscribes successfully to context value changes", async () => {
            const result = render(
                <RootProvider>
                    <Sample />
                </RootProvider>,
            );
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
        });
    });
});
