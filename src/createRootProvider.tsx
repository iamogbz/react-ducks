import * as React from "react";
import { Provider } from "./components/Provider";

export function createRootProvider<S, T extends Action>(
    Context: Context<S, T>,
) {
    return function RootProvider({
        children,
    }: React.PropsWithChildren<unknown>): React.ReactElement {
        return <Provider Context={Context}>{children}</Provider>;
    };
}
