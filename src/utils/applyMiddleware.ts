// github.com/reduxjs/redux/blob/8551ba8/src/applyMiddleware.ts
import { compose } from "./compose";

export function applyMiddleware<S, T extends string, P>(
    ...middlewares: Middleware<S, T, P>[]
): ContextEnhance<S, T, P> {
    return function enhancer(
        context: ContextValue<S, T, P>,
    ): ContextValue<S, T, P> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function dispatchStub(...args: unknown[]): never {
            throw new Error(
                "Dispatching while constructing your middleware is not allowed. " +
                    "Other middleware would not be applied to this dispatch.",
            );
        }

        const middlewareAPI: MiddlewareAPI<S, T, P> = {
            dispatch: dispatchStub,
            getState: context.getState,
        };
        const chain = middlewares.map((middleware) =>
            middleware(middlewareAPI),
        );
        const dispatch = compose<typeof context.dispatch>(...chain)(
            context.dispatch,
        );
        return {
            ...context,
            dispatch,
        };
    };
}
