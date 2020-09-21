import * as React from "react";

export function useAccessor<R>(
    value?: R,
): [() => R | undefined, ((v: R) => void) | undefined] {
    const ref = React.useRef(value);

    const getValue = React.useCallback(function getValue() {
        return ref.current;
    }, []);
    const setValue = React.useCallback(function setValue(value) {
        ref.current = value;
    }, []);

    // If a value was initially provided then no setter is returned
    const maybeSetValue = React.useMemo(function getSetValue() {
        return value === undefined ? setValue : undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // If a value was initially provided then keep the ref updated
    if (!maybeSetValue) setValue(value);

    return [getValue, maybeSetValue];
}
