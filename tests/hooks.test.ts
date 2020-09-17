import { act, renderHook } from "@testing-library/react-hooks";
import { useDispatch } from "src";
import { createContextWithValue } from "src/createContext";
import { useObservable } from "src/hooks/useObservable";

describe("useDispatch", () => {
    const mockValue = {
        dispatch: async (a: Action<string, string>) => a,
        reducer: () => null,
        state: null,
        subscribe: () => ({ closed: true, unsubscribe: () => undefined }),
    };

    it("uses dispatch from Context", () => {
        const dispatch = jest.fn(mockValue.dispatch);
        const context = createContextWithValue({ ...mockValue, dispatch });
        const ACTION_TYPE = "ACTION_TYPE" as const;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const actionCreator = (payload?: string) => ({
            payload,
            type: ACTION_TYPE,
        });
        const { result } = renderHook(() =>
            useDispatch(actionCreator, context),
        );
        const arg0 = "Some argument";
        result.current(arg0);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
            payload: arg0,
            type: ACTION_TYPE,
        });
    });

    it.each`
        actionCreator
        ${"non function"}
        ${null}
        ${undefined}
    `("fails to use dispatch with actionCreator", ({ actionCreator }) => {
        const context = createContextWithValue(mockValue);
        const { result } = renderHook(() =>
            useDispatch(actionCreator, context),
        );
        expect(() => result.current).toThrow("Unable to bind action creator");
    });
});

describe("useObservable", () => {
    it("returns an observable with a self reference", () => {
        const getValue = jest.fn(() => ({ value: 9 }));
        const { result } = renderHook(() => useObservable(getValue));
        expect(result.current).toMatchObject({
            [Symbol.observable]: expect.any(Function),
            subscribe: expect.any(Function),
            value: 9,
        });
        expect(result.current[Symbol.observable]()).toBe(result.current);
    });

    it("adds multiple subscriptions", () => {
        const getValue = jest.fn(() => ({ value: 9 }));
        const { result, rerender } = renderHook(() => useObservable(getValue));

        const listener1 = jest.fn();
        result.current.subscribe(listener1);
        expect(listener1).not.toHaveBeenCalled();

        const listener2 = jest.fn();
        const listener2start = jest.fn();
        const observer2 = {
            complete: () => undefined,
            error: () => undefined,
            next: listener2,
            start: listener2start,
        };
        result.current.subscribe(observer2);
        expect(listener2start).toHaveBeenCalledWith({
            closed: false,
            unsubscribe: expect.any(Function),
        });
        expect(listener2).not.toHaveBeenCalled();

        getValue.mockReturnValue({ value: 12 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener1).toHaveBeenLastCalledWith(
            expect.objectContaining({ value: 12 }),
        );
        expect(listener2).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenLastCalledWith(
            expect.objectContaining({ value: 12 }),
        );

        const listener3 = jest.fn();
        const [[arg0]] = listener2.mock.calls.slice(-1);
        arg0.subscribe(listener3);
        expect(listener3).not.toHaveBeenCalled();

        getValue.mockReturnValue({ value: 15 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(2);
        expect(listener2).toHaveBeenCalledTimes(2);
        expect(listener3).toHaveBeenCalledTimes(1);
        expect(listener3).toHaveBeenLastCalledWith(
            expect.objectContaining({ value: 15 }),
        );
    });

    it("does not add the same observer multiple times", () => {
        const getValue = jest.fn(() => ({ value: 9 }));
        const { result, rerender } = renderHook(() => useObservable(getValue));
        const listener1 = jest.fn();
        result.current.subscribe(listener1);
        result.current.subscribe(listener1);
        expect(listener1).not.toHaveBeenCalled();

        getValue.mockReturnValue({ value: 12 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(1);
        getValue.mockReturnValue({ value: 15 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(2);
    });

    it("does not remove the same observer multiple times", () => {
        const getValue = jest.fn(() => ({ value: 9 }));
        const { result, rerender } = renderHook(() => useObservable(getValue));

        const listener1 = jest.fn();
        const listener1complete = jest.fn();
        const subscriber1 = result.current.subscribe(
            listener1,
            undefined,
            listener1complete,
        );
        expect(listener1).not.toHaveBeenCalled();

        const listener2 = jest.fn();
        const listener2complete = jest.fn();
        const observer2 = {
            complete: listener2complete,
            error: () => undefined,
            next: listener2,
            start: () => undefined,
        };
        const subscriber2 = result.current.subscribe(observer2);
        expect(listener2).not.toHaveBeenCalled();

        getValue.mockReturnValue({ value: 12 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener1).toHaveBeenLastCalledWith(
            expect.objectContaining({ value: 12 }),
        );
        expect(listener2).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenLastCalledWith(
            expect.objectContaining({ value: 12 }),
        );
        listener1.mockClear();
        listener2.mockClear();

        act(subscriber2.unsubscribe);
        expect(subscriber2.closed).toBe(true);
        expect(listener1complete).not.toHaveBeenCalled();
        expect(listener2complete).toHaveBeenCalledTimes(1);
        getValue.mockReturnValue({ value: 15 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).not.toHaveBeenCalled();

        act(subscriber1.unsubscribe);
        act(subscriber2.unsubscribe);
        expect(listener1complete).toHaveBeenCalledTimes(1);
        expect(listener2complete).toHaveBeenCalledTimes(1);
        expect(subscriber1.closed).toBe(true);
        expect(subscriber2.closed).toBe(true);
        getValue.mockReturnValue({ value: 18 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).not.toHaveBeenCalled();
    });

    it("sends error value to observers", () => {
        const getValue = jest.fn(() => ({ value: 9 }));
        const { result, rerender } = renderHook(() => useObservable(getValue));

        const listener1 = jest.fn();
        const listener1error = jest.fn();
        const subscriber1 = result.current.subscribe(listener1, listener1error);
        expect(listener1).not.toHaveBeenCalled();
        expect(listener1error).not.toHaveBeenCalled();
        expect(subscriber1.closed).toBe(false);

        const listener2 = jest.fn();
        const listener2error = jest.fn();
        const listener2complete = jest.fn();
        const observer2 = {
            complete: listener2complete,
            error: listener2error,
            next: listener2,
            start: () => {
                throw new Error("Failed to start");
            },
        };
        const subscriber2 = result.current.subscribe(observer2);
        expect(listener2).not.toHaveBeenCalled();
        expect(listener2error).toHaveBeenCalledTimes(1);
        expect(listener2error).toHaveBeenLastCalledWith(
            new Error("Failed to start"),
        );
        expect(listener2complete).toHaveBeenCalledTimes(1);
        expect(subscriber2.closed).toBe(true);

        getValue.mockReturnValue({ value: 12 });
        act(rerender);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).not.toHaveBeenCalled();
    });
});
