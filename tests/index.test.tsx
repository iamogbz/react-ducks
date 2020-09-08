import * as React from "react";
import { act, cleanup, render } from "@testing-library/react";
import {
    createContext,
    createDuck,
    createRootDuck,
    createRootProvider,
} from "src";

describe("e2e", (): void => {
    const increment = jest.fn((state: number): number => state + 1);
    const decrement = jest.fn((state: number): number => state - 1);
    const counterDuck = createDuck({
        name: "counter",
        initialState: 0,
        reducers: { decrement, increment },
    });

    const init = jest.fn((): boolean => true);
    const initDuck = createDuck({
        name: "init",
        initialState: false,
        reducers: { init },
    });

    const rootDuck = createRootDuck(counterDuck, initDuck);

    const Context = createContext(
        rootDuck.reducer,
        rootDuck.initialState,
        "TestContext",
    );

    const Provider = createRootProvider(Context);

    function Example(): React.ReactElement {
        const { state, dispatch } = React.useContext(Context);
        React.useEffect(() => {
            dispatch(initDuck.actions.init());
        }, [dispatch]);
        const increment = React.useCallback(() => {
            dispatch(counterDuck.actions.increment());
        }, [dispatch]);
        return (
            <div>
                Count: <span>{state[counterDuck.name]}</span>
                <button disabled={!state[initDuck.name]} onClick={increment}>
                    increment
                </button>
            </div>
        );
    }

    afterEach(() => {
        increment.mockClear();
        init.mockClear();
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
            <Provider>
                <Example />
            </Provider>,
        );
        await act(() => result.findByText("increment").then((e) => e.click()));
        expect(increment).toHaveBeenCalled();
        await act(() => result.findByText("increment").then((e) => e.click()));
        expect(result.baseElement).toMatchSnapshot();
        expect(init).toHaveBeenCalledTimes(1);
    });
});
