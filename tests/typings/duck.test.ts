/* eslint-disable jest/expect-expect */

import { forType } from ".";

describe("duck.d", () => {
    describe("define Action<T, P>", () => {
        it("type and payload", () => {
            const t0 = forType<Action>();
            t0.accept({ type: "some string" });
            t0.accept({ payload: "some payload", type: "some string" });

            const t1 = forType<Action<"actionType">>();
            t1.accept({ type: "actionType" });
            t1.reject({ payload: "some payload", type: "some string" });

            const t2 = forType<Action<"actionType", boolean>>();
            t2.accept({ payload: true, type: "actionType" });
            t2.reject({ payload: "some payload", type: "actionType" });
        });
    });

    describe("define Reducer<S, A>", () => {
        type State = { v: boolean };

        it("for const action type mapping type", () => {
            type T = Reducer<
                State,
                Action<"action1"> | Action<"action2", [1, 2, 3]>
            >;
            const t = forType<T>();

            t.accept(() => ({ v: false }));
            t.accept((_state: { v: boolean }) => ({ v: false }));
            t.accept(
                (
                    _state: { v: boolean },
                    _action:
                        | Action<"action1">
                        | Action<"action2", readonly [1, 2, 3]>,
                ) => ({ v: false }),
            );
            // reject wrong return type
            t.reject(() => ({ v: null }));
            // reject extra action types
            t.reject(
                (
                    _state: { v: boolean },
                    _action: Action<"action1" | "action2" | "action3", boolean>,
                ) => ({ v: false }),
            );
            // reject ambiguous action type to payload mapping
            t.reject(
                (
                    _state: { v: boolean },
                    _action: Action<
                        "action1" | "action2",
                        undefined | [1, 2, 3]
                    >,
                ) => ({ v: false }),
            );
        });

        it("for fluid action type mapping type", () => {
            type T = Reducer<
                State,
                Action<"action1"> | Action<"action2", [1, 2, 3]>
            >;
            const t = forType<T>();
            t.accept(
                (
                    _state: { v: boolean },
                    _action:
                        | Action<"action1">
                        | Action<"action2", readonly [1, 2, 3]>,
                ) => ({ v: false }),
            );
            // widened action types
            t.accept(
                (
                    _state: { v: boolean },
                    _action: Action<string> | Action<"action2", [1, 2, 3]>,
                ) => ({ v: false }),
            );
            t.accept(
                (
                    _state: { v: boolean },
                    _action: Action<"action1" | "action2", unknown>,
                ) => ({ v: false }),
            );
            t.accept((_state: { v: boolean }, _action: Action) => ({
                v: false,
            }));
            // narrowed action type (missing action1 support)
            t.reject(
                (
                    _state: { v: boolean },
                    _action: Action<"action2", [1, 2, 3]>,
                ) => ({
                    v: false,
                }),
            );
        });
    });

    describe("define DuckActionCreators<T, S>", () => {
        it("creates reducer actions", () => {
            type Actions =
                | Action<"action1", boolean>
                | Action<"action2", number>;
            type State = { name: string; age: number };
            type T = DuckActionCreators<Actions, State>;
            const t = forType<T>();

            t.accept(() => ({ type: "action1" as const }));
            t.accept((payload?: boolean) => ({
                payload,
                type: "action1" as const,
            }));
            t.accept(() => ({ type: "action2" as const }));
            t.accept((payload?: number) => ({
                payload,
                type: "action2" as const,
            }));

            t.reject((payload: number) => ({
                payload,
                type: "action1",
            })); // wrong payload type
            t.reject((payload: boolean) => ({
                payload,
                type: "action2",
            })); // wrong payload type
        });
    });

    describe("define ActionDispatcher<T, Args>", () => {
        it("creates action dispatcher", () => {
            type Actions =
                | Action<"action1", boolean>
                | Action<"action2", number>;
            type T0 = ActionDispatcher<Actions>;
            const t0 = forType<T0>();
            t0.accept(() => undefined);
            t0.accept((_p: number | boolean | undefined) => undefined);
            t0.accept(
                (_p: number | boolean | undefined, _arg0: never, _arg1) =>
                    undefined,
            );
            t0.reject((_p: number) => undefined);

            type T1 = ActionDispatcher<Actions, [number]>;
            const t1 = forType<T1>();
            t1.accept(() => undefined);
            t1.accept((_p: number | boolean | undefined) => false);
            t1.reject((_p: number) => undefined);
            t1.accept(
                (_p: number | boolean | undefined, _arg0: number) => undefined,
            );
        });
    });

    describe("define ActionReducerMapping<S, T>", () => {
        it("maps action types to reducers", () => {
            type State = { v: 1 };
            type Actions =
                | Action<"action1", boolean>
                | Action<"action2", number>;
            type T = ActionReducerMapping<State, Actions>;
            const t = forType<T>();

            t.accept({
                action1: (s: State, _a?: Action<"action1", boolean>) => s,
                action2: (s: State, _a?: Action<"action2", number>) => s,
            });
            t.accept({
                action1: (s: State) => s,
                action2: (s: State) => s,
            });
            t.accept({
                action1: (s: State, _a: unknown) => s,
                action2: (s: State) => s,
            });
            t.reject({
                action1: (s: State) => s,
            }); // missing action2
            t.reject({
                action1: (s: State, _a?: Action<"action1", number>) => s,
                action2: (s: State) => s,
            }); // wrong action 1 payload type
        });
    });

    describe("define Duck<N, S, T, U>", () => {
        it("creates duck form minimal generics", () => {
            type State = { time: number };
            type A1 = Action<"action1">;
            type A2 = Action<"action2">;
            type D = Duck<
                "duckName",
                State,
                {
                    createAction1: ActionCreator<"action1", unknown, State>;
                    createAction2: ActionCreator<"action2", unknown, State>;
                },
                {
                    selector1: (
                        s: Record<string, State>,
                        arg1: number,
                    ) => boolean;
                    selector2: (s: Record<"duckName", State>) => string;
                }
            >;
            const t = forType<D>();

            t.accept({
                actionTypes: ["action1", "action2"],
                actions: {
                    createAction1: () => ({ type: "action1" }),
                    createAction2: () => ({ type: "action2" }),
                },
                initialState: { time: 0 },
                name: "duckName",
                reducer: (s: State, _a?: A1 | A2) => s,
                selectors: {
                    $: (s: Record<string, State>) => s["duckName"],
                    selector1: (_s: Record<string, State>) => true,
                    selector2: (_s: Record<string, State>) => "false",
                },
            });

            // action3 is not accepted in the list of actions
            t.reject({
                actionTypes: ["action1", "action2", "action3"],
                actions: {
                    createAction1: (): A1 => ({ type: "action1" }),
                    createAction2: (): A2 => ({ type: "action2" }),
                },
                initialState: { time: 0 },
                name: "duckName",
                reducer: (s: State, _a?: A1 | A2) => s,
                selectors: {
                    $: (s: Record<string, State>) => s["duckName"],
                    selector1: (_s: Record<string, State>) => true,
                    selector2: (_s: Record<string, State>) => "false",
                },
            });

            // initial state wrong type
            t.reject({
                actionTypes: ["action1", "action2"],
                actions: {
                    createAction1: (): A1 => ({ type: "action1" }),
                    createAction2: (): A2 => ({ type: "action2" }),
                },
                initialState: { time: false },
                name: "duckName",
                reducer: (s: State, _a?: A1 | A2) => s,
                selectors: {
                    $: (s: Record<string, State>) => s["duckName"],
                    selector1: (_s: Record<string, State>) => true,
                    selector2: (_s: Record<string, State>) => "false",
                },
            });

            // wrong duck name
            t.reject({
                actionTypes: ["action1", "action2"],
                actions: {
                    createAction1: (): A1 => ({ type: "action1" }),
                    createAction2: (): A2 => ({ type: "action2" }),
                },
                initialState: { time: 0 },
                name: "duckName2",
                reducer: (s?: State, _a?: A1 | A2) => s,
                selectors: {
                    $: (s: Record<string, State>) => s["duckName"],
                    selector1: (_s: Record<string, State>) => true,
                    selector2: (_s: Record<string, State>) => "false",
                },
            });

            t.reject({
                actionTypes: ["action1", "action2"],
                actions: {
                    createAction1: () => ({ type: "action1" }),
                    createAction2: () => ({ type: "action2" }),
                },
                initialState: { time: 0 },
                name: "duckName",
                reducer: (s: State, _a?: A1 | A2) => s,
                selectors: {
                    $: (s: Record<string, State>) => s["duckName"],
                    selector1: (_s: Record<string, State>) => "true",
                    selector2: (_s: Record<string, State>) => "false",
                },
            }); // selector wrong return
        });
    });

    describe("define RootDuck<Ducks>", () => {
        it("creates root duck from ducks", () => {
            const duckA = {
                actionTypes: ["duckA/one", "duckA/two"],
                actions: {
                    one: () => ({ type: "duckA/one" }),
                    two: () => ({ type: "duckA/two" }),
                },
                initialState: false,
                name: "duckA",
                reducer: (s: boolean) => s,
                selectors: {
                    $: (s) => s["duckA"],
                    find: (s) => s["duckA"],
                },
            } as Duck<
                "duckA",
                boolean,
                {
                    one: ActionCreator<"duckA/one">;
                    two: ActionCreator<"duckA/two">;
                },
                {
                    find: (s: Record<"duckA", boolean>) => boolean;
                }
            >;
            const duckB = {
                actionTypes: ["duckBee/one"],
                actions: {
                    one: () => ({ type: "duckBee/one" }),
                },
                initialState: false,
                name: "duckBee",
                reducer: (s, _a) => s,
                selectors: {
                    $: (s) => s["duckBee"],
                },
            } as Duck<
                "duckBee",
                boolean,
                { one: ActionCreator<"duckBee/one"> }
            >;
            type T = RootDuck<[typeof duckA, typeof duckB]>;
            const t = forType<T>();

            t.accept({
                actions: {
                    duckA: {
                        one: () => ({ type: "duckA/one" }),
                        two: () => ({ type: "duckA/two" }),
                    },
                    duckBee: {
                        one: () => ({ type: "duckBee/one" }),
                        two: () => ({ type: "duckBee/two" }),
                    },
                },
                initialState: {
                    duckA: false,
                    duckBee: false,
                },
                names: ["duckA", "duckBee"],
                reducer: (s: { duckA: boolean; duckBee: boolean }) => s,
                selectors: {
                    duckA: {
                        $: (s) => s["duckA"],
                        find: (_s) => false,
                    },
                    duckBee: {
                        $: (s) => s["duckBee"],
                    },
                },
            });
        });
    });
});
