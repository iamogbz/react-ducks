import * as React from "react";
import { Provider } from "./components/Provider";

export function createRootProvider<State>(
    Context: React.Context<ContextValue<State>>,
) {
    return function RootProvider({
        children,
    }: {
        children?: React.ReactNode;
    }): React.ReactElement {
        return <Provider Context={Context}>{children}</Provider>;
    };
}
