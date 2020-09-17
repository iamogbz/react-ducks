export function isFunction<F>(maybeFunction: F | unknown): maybeFunction is F {
    return typeof maybeFunction === "function";
}
