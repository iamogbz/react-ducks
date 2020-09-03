import { createContext } from "src";

describe("createContext", () => {
    it("creates context without displayname", () => {
        const Context = createContext((s) => s, {});
        expect(Context.displayName).toBeUndefined;
    });

    it("creates context with displayname", () => {
        const Context = createContext((s) => s, {}, "TextContext");
        expect(Context.displayName).toEqual("TextContext");
    });
});
