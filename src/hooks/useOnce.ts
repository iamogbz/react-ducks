import * as React from "react";

export function useOnce(callback: React.EffectCallback): void {
    const isFirstRun = React.useRef(true);
    if (!isFirstRun.current) return;
    callback();
    isFirstRun.current = false;
}
