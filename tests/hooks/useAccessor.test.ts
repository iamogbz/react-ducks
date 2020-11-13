import { renderHook } from "@testing-library/react-hooks";
import { useAccessor } from "src/hooks/useAccessor";

describe("useAccessor", () => {
    const renderAccessorHook = <V>(initialValue?: V) =>
        renderHook((value = initialValue) => useAccessor(value));

    it("returns a getter and setter if no initial value provided", () => {
        const { result, rerender } = renderAccessorHook();
        const [getter, setter] = result.current;
        expect(getter()).toBeUndefined();
        expect(setter).toBeDefined();
        setter?.("some value");
        expect(getter()).toBe("some value");
        rerender("other value");
        expect(getter()).toBe("some value");
    });

    it("returns a getter only if an initial value is provided", () => {
        const { result, rerender } = renderAccessorHook("initial value");
        const [getter, setter] = result.current;
        expect(getter()).toBe("initial value");
        expect(setter).toBeUndefined();
        expect(getter()).toBe("initial value");
        rerender("other value");
        expect(getter()).toBe("other value");
    });
});
