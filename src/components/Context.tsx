import * as React from "react";

const PlaceholderContext = React.createContext(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let GlobalContext: React.Context<any> = PlaceholderContext;

export function setGlobalContext<T>(Context: React.Context<T>): void {
    if (GlobalContext !== PlaceholderContext) {
        throw new Error("Global context can only be set once");
    }
    GlobalContext = Context;
}
