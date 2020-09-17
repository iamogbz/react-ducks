function polyfillSymbol(name: string) {
    if (!Symbol[name]) {
        Object.defineProperty(Symbol, name, { value: Symbol(name) });
    }
}

polyfillSymbol("observable");
