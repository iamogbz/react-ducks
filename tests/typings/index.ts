import { canAssign } from "type-plus";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function forType<T>() {
    return {
        accept: canAssign<T>(),
        reject: canAssign<T>(false),
    };
}
