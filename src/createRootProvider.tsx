import * as React from "react";
import { Provider } from "./components/Provider";

export function createRootProvider<S, T extends string, P>(
    Context: Context<S, T, P>,
) {
    return function RootProvider({
        children,
    }: React.PropsWithChildren<unknown>): React.ReactElement {
        return <Provider Context={Context}>{children}</Provider>;
    };
}
