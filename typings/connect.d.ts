type MapStateToProps<S = unknown, I = unknown, J = I> = Selector<
    S,
    J,
    string,
    unknown,
    [I]
>;

type MapDispatchToProps<
    T extends string,
    P = unknown,
    I extends Record = Record,
    J extends ActionDispatcherMapping<T, P> = ActionDispatcherMapping<T, P>
> = (dispatch: ContextDispatch<T, P>, ownProps?: I) => J;

type MergeProps<
    T extends string = string,
    P = unknown,
    I extends Record = Record,
    K extends Record = Record,
    J extends Record = I & K & ActionDispatcherMapping<T, P>
> = (
    stateProps?: K,
    dispatchProps?: ActionDispatcherMapping<T, P>,
    ownProps?: I,
) => J;

type ConnectOptions<
    S = unknown,
    T extends string = string,
    P = unknown,
    I extends Record = Record, // Component own props
    K extends Record = Record, // Mapped state props
    J extends Record = I & K & ActionDispatcherMapping<T, P> // Merged props i.e. own & state & mapped dispatch props
> = {
    // areMergedPropsEqual?: (next: J, prev: J) => boolean;
    // areOwnPropsEqual?: (next: I, prev: I) => boolean;
    // areStatePropsEqual?: (next: K, prev: K) => boolean;
    // areStatesEqual?: (next: S, prev: S) => boolean;
    context?: Context<S, T, P>;
    forwardRef?: boolean;
    pure?: boolean;
};

type ReactComponent<I = unknown> =
    | React.FunctionComponent<I>
    | React.ComponentClass<I>;
