import { helloWorld } from "src/index";

describe("entry", (): void => {
    it("runs a test", (): void => {
        expect(helloWorld()).toMatchSnapshot();
    });
});
