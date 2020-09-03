import helloWorld from "src/example";

describe("example", (): void => {
    it("runs a test", (): void => {
        expect(helloWorld()).toMatchSnapshot();
    });
});
