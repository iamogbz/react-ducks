// github.com/reduxjs/redux/blob/8551ba8/src/applyMiddleware.ts
import { compose } from "./compose";

export function applyMiddleware<State, T extends Action>(
    ...middlewares: Middleware<State, ContextDispatch<T>>[]
): ContextEnhance<State, T> {
    return function enhancer(context: ContextValue<State, T>) {
        function dispatchStub(): never {
            throw new Error(
                "Dispatching while constructing your middleware is not allowed. " +
                    "Other middleware would not be applied to this dispatch.",
            );
        }

        const middlewareAPI: MiddlewareAPI<State, ContextDispatch<T>> = {
            dispatch: dispatchStub,
            getState: context.getState,
        };
        const chain = middlewares.map((middleware) =>
            middleware(middlewareAPI),
        );
        const dispatch = compose(...chain)(context.dispatch);
        return {
            ...context,
            dispatch,
        };
    };
}
