function polyfillSymbol(name: string) {
    try {
        Object.defineProperty(Symbol, name, { value: Symbol(name) });
    } catch (e) {
        // do nothing
    }
}

export function polyfillObservable(): void {
    return polyfillSymbol("observable");
}
