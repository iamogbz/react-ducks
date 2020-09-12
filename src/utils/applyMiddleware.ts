// github.com/reduxjs/redux/blob/8551ba8/src/applyMiddleware.ts
import { compose } from "./compose";

export function applyMiddleware<S, T extends string, P>(
    ...middlewares: Middleware<S, T, P>[]
): ContextEnhance<S, T, P> {
    return function enhance(
        context: ContextValue<S, T, P>,
    ): ContextValue<S, T, P> {
        const dispatchStub: ContextDispatch<T, P> = () => {
            throw new Error(
                "Dispatching while constructing your middleware is not allowed. " +
                    "Other middleware would not be applied to this dispatch.",
            );
        };

        const middlewareAPI: MiddlewareAPI<S, T, P> = {
            getState: context.getState,
            dispatch: (action, ...args) => dispatchStub(action, ...args),
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
