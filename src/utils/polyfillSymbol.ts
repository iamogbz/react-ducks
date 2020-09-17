function polyfillSymbol(name: string): void {
    if (!Symbol[name]) {
        Object.defineProperty(Symbol, name, { value: Symbol(name) });
    }
}

polyfillSymbol("observable");
