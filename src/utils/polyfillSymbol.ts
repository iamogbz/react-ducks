function polyfillSymbol(name: string) {
    try {
        Object.defineProperty(Symbol, name, { value: Symbol(name) });
    } catch (e) {
        // do nothing
    }
}

polyfillSymbol("observable");
