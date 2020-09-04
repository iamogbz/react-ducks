declare global {
    interface SymbolConstructor {
        readonly observable: symbol;
    }
}

export const SymbolObservable: SymbolConstructor["observable"] =
    Symbol.observable || Symbol("@@observable");
