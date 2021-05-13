/* eslint-disable jest/expect-expect */

import { forType } from ".";

describe("utils.d", () => {
    it("defines Nullable<T> to accepts only null and undefined values", () => {
        const t = forType<Nullable<"value" | "other">>();
        // accept
        t.accept(null);
        t.accept(undefined);
        t.accept("value");
        t.accept("other");
        // reject
        t.reject(0);
        t.reject(false);
        t.reject("fool");
        t.reject("none value");
    });

    it("defines RequiredKeys<T, K> to only requires specified keys", () => {
        const t =
            forType<RequiredKeys<{ propA: number; propB: "2" }, "propA">>();

        t.accept({ propA: 1 });
        t.accept({ propA: 2, propB: "2" });

        t.reject({ propB: "2" });
        t.reject({ propA: 2, propB: "2" });
        t.reject({
            propA: 2,
            propB: "2",
            propC: undefined,
        });
    });

    it("defines OptionalKeys<T, K> to only requires unspecified keys", () => {
        const t =
            forType<
                OptionalKeys<
                    { propA: number; propB: "2"; propC?: undefined },
                    "propA"
                >
            >();

        t.accept({ propA: 2, propB: "2" });
        t.accept({ propB: "2" });

        t.reject({ propB: 1 });
        t.reject({ propA: 2, propB: "hello" });
        t.reject({
            propA: 2,
            propB: "2",
            propC: null,
        });
    });

    it("defines Transpose<T, A, B> to rotate union type correctly", () => {
        type T = Transpose<
            | {
                  name: "one";
                  type: boolean;
              }
            | {
                  name: "of";
                  type: string;
              }
            | {
                  name: "these";
                  type: number;
              },
            "name",
            "type"
        >;
        const t = forType<T>();

        t.accept({
            of: "string",
            one: true,
            these: 1,
        });

        t.reject({
            of: "types",
            one: true,
            these: "must match",
        });

        t.reject({
            keys: "allowed",
            no: "extra",
            of: "string",
            one: true,
            these: "string",
        });
    });

    it("defines Entry<T> to gets object entry", () => {
        const t = forType<Entry<{ one: 1; two: "two"; three: boolean }>>();

        t.accept(["one", 1]);
        t.accept(["two", "two"]);
        t.accept(["three", false]);

        t.reject(["one", "must match types"]);
        t.reject(["two", "2"]);
        t.reject(["three", 0]);
    });

    it("defines Entries<T> to gets object entries", () => {
        const t = forType<Entries<{ one: 1; two: "two"; three: boolean }>>();
        // not restricted by length
        t.accept([
            ["two", "two"],
            ["one", 1],
            ["two", "two"],
            ["three", false],
            ["one", 1],
            ["three", true],
        ]);
        // must match pairs
        t.reject([
            ["three", 1],
            ["one", "two"],
            ["two", false],
        ]);
    });

    it("defines Last<T> to gets last array entry type", () => {
        const t0 = forType<Last<[1, "2", 3, 4]>>();
        t0.accept(4);
        t0.reject(3);

        const t1 = forType<Last<number[]>>();
        t1.accept(4);
        t1.accept(3);
        t1.reject("3");

        const t2 = forType<Last<[number, string]>>();
        t2.accept("4");
        t2.accept("3");
        t2.reject(3);
        t2.reject(4);
    });

    it("defines Callable<...A, R> to identify functions", () => {
        const t = forType<Callable<[number, string, boolean], boolean>>();

        t.accept(() => true);
        t.accept(() => true);
        t.accept((..._args: unknown[]) => true);
        t.accept((..._args: [number, string]) => true);

        // reject wrong positional argument
        t.reject((_arg: string) => true);
        // reject wrong return type
        t.reject((_arg: number) => undefined);
        // reject wrong return type
        t.reject((..._args: [number, string, boolean]) => 0);
        // rejec textra argument
        t.reject((..._args: [number, string, boolean, number]) => true);
    });
});
