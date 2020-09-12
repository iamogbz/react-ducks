import * as React from "react";

export function useGetter<R>(value: R): () => R {
    const ref = React.useRef(value);
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return React.useCallback(
        function getValue() {
            return ref.current;
        },
        [ref],
    );
}
