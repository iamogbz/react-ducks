import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useObservable } from "src/hooks/useObservable";

describe("useObservable", () => {
    const renderObservableHook = <P>(initialProps: P) =>
        renderHook((props = initialProps) => useObservable(props));

    it("returns an observable with a self reference", () => {
        const { result } = renderObservableHook({ value: 9 });
        expect(result.current[0]).toMatchObject({
            [Symbol.observable]: expect.any(Function),
            subscribe: expect.any(Function),
            value: 9,
        });
        expect(result.current[0][Symbol.observable]()).toBe(result.current[0]);
    });

    it("adds multiple subscriptions", () => {
        const { result, rerender } = renderObservableHook({ value: 9 });

        const listener1 = jest.fn();
        result.current[0].subscribe(listener1);
        expect(listener1).not.toHaveBeenCalled();

        const listener2 = jest.fn();
        const listener2start = jest.fn();
        const observer2 = {
            complete: () => undefined,
            error: () => undefined,
            next: listener2,
            start: listener2start,
        };
        result.current[0].subscribe(observer2);
        expect(listener2start).toHaveBeenCalledWith({
            closed: false,
            unsubscribe: expect.any(Function),
        });
        expect(listener2).not.toHaveBeenCalled();

        act(() => rerender({ value: 12 }));
        act(result.current[1]);
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

        act(() => rerender({ value: 15 }));
        act(result.current[1]);
        expect(listener1).toHaveBeenCalledTimes(2);
        expect(listener2).toHaveBeenCalledTimes(2);
        expect(listener3).toHaveBeenCalledTimes(1);
        expect(listener3).toHaveBeenLastCalledWith(
            expect.objectContaining({ value: 15 }),
        );
    });

    it("does not add the same observer multiple times", () => {
        const { result, rerender } = renderObservableHook({ value: 9 });
        const listener1 = jest.fn();
        result.current[0].subscribe(listener1);
        result.current[0].subscribe(listener1);
        expect(listener1).not.toHaveBeenCalled();

        act(() => rerender({ value: 12 }));
        act(result.current[1]);
        expect(listener1).toHaveBeenCalledTimes(1);
        act(() => rerender({ value: 15 }));
        act(rerender);
        act(result.current[1]);
        expect(listener1).toHaveBeenCalledTimes(2);
    });

    it("does not remove the same observer multiple times", () => {
        const { result, rerender } = renderObservableHook({ value: 9 });

        const listener1 = jest.fn();
        const listener1complete = jest.fn();
        const subscriber1 = result.current[0].subscribe(
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
        const subscriber2 = result.current[0].subscribe(observer2);
        expect(listener2).not.toHaveBeenCalled();

        act(() => rerender({ value: 12 }));
        act(result.current[1]);
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
        act(() => rerender({ value: 15 }));
        act(result.current[1]);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).not.toHaveBeenCalled();

        act(subscriber1.unsubscribe);
        act(subscriber2.unsubscribe);
        expect(listener1complete).toHaveBeenCalledTimes(1);
        expect(listener2complete).toHaveBeenCalledTimes(1);
        expect(subscriber1.closed).toBe(true);
        expect(subscriber2.closed).toBe(true);
        act(() => rerender({ value: 18 }));
        act(result.current[1]);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).not.toHaveBeenCalled();
    });

    it("sends error value to observers", () => {
        const { result, rerender } = renderObservableHook({ value: 9 });

        const listener1 = jest.fn();
        const listener1error = jest.fn();
        const subscriber1 = result.current[0].subscribe(
            listener1,
            listener1error,
        );
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
        const subscriber2 = result.current[0].subscribe(observer2);
        expect(listener2).not.toHaveBeenCalled();
        expect(listener2error).toHaveBeenCalledTimes(1);
        expect(listener2error).toHaveBeenLastCalledWith(
            new Error("Failed to start"),
        );
        expect(listener2complete).toHaveBeenCalledTimes(1);
        expect(subscriber2.closed).toBe(true);

        act(() => rerender({ value: 12 }));
        act(result.current[1]);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).not.toHaveBeenCalled();
    });
});
