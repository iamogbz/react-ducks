import * as React from "react";
import { GlobalContext } from "..";

export function useSelector<S, R, T extends string, P>(
    selector?: Selector<S, R, T, P>,
    Context?: Context<S, T, P>,
): Nullable<R> {
    const { state } = React.useContext(Context ?? GlobalContext);
    return React.useMemo(
        function select() {
            return selector?.(state);
        },
        [selector, state],
    );
}
