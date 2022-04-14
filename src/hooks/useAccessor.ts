import * as React from "react";

export function useAccessor<R>(
    value?: R,
): [() => R | undefined, ((v: R) => void) | undefined] {
    const ref = React.useRef(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialized = React.useMemo(() => value !== undefined, []);

    const getValue = React.useCallback(function getValue() {
        return ref.current;
    }, []);
    const setValue = React.useCallback(function setValue(value?: R) {
        ref.current = value;
    }, []);

    // If a value was initially provided then keep the ref updated
    if (initialized) setValue(value);
    // If a value was initially provided then no setter is returned
    return [getValue, initialized ? undefined : setValue];
}
