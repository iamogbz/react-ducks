import * as React from "react";
import { GlobalContext } from "../components/Context";

export function useSelector<S, R, T extends string, P>(
    selector: Selector<S, R, T, P> | undefined,
    Context?: Context<S, T, P>,
): R | undefined {
    const { state } = React.useContext(Context ?? GlobalContext);
    return React.useMemo(
        function select() {
            return selector?.(state);
        },
        [selector, state],
    );
}
