import * as React from "react";
import { GlobalContext } from "..";

export function useSelector<S, R, E extends unknown[], T extends string, P>(
    selector: Selector<S, R, E, T, P>,
    Context?: Context<S, T, P>,
    ...args: E
): Nullable<R> {
    const { state } = React.useContext(Context ?? GlobalContext);
    return React.useMemo(
        function select() {
            return selector(state, ...args);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selector, state, ...args],
    );
}
