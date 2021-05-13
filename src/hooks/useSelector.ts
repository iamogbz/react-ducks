import * as React from "react";
import { GlobalContext } from "..";

export function useSelector<
    State,
    Returns,
    ExtraArguments extends unknown[],
    T extends Action,
>(
    selector: Selector<State, Returns, ExtraArguments>,
    Context?: Context<State, T>,
    ...args: ExtraArguments
): Nullable<Returns> {
    const { state } = React.useContext(Context ?? GlobalContext);
    return React.useMemo(
        function select() {
            return selector(state, ...args);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selector, state, ...args],
    );
}
