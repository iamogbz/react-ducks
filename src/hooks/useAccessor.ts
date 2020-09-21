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

    if (value) setValue(value);
    return [
        getValue,
        React.useMemo(() => (value ? undefined : setValue), [setValue, value]),
    ];
}
