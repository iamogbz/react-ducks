import * as React from "react";
import { Provider } from "./components/Provider";

export function createRootProvider<State>(Context: Context<State>) {
    return function RootProvider({
        children,
    }: React.PropsWithChildren<{}>): React.ReactElement {
        return <Provider Context={Context}>{children}</Provider>;
    };
}
