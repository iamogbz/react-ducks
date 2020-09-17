import { createAction } from "src";

describe("createAction", () => {
    it("creates action with prepared payload", () => {
        const type = "expectedType";
        const payload = "expectedPayload";
        const actionCreator = createAction(type, (payload) => ({
            error: true,
            payload,
            type: "shouldBeOverwritten",
        }));
        expect(actionCreator(payload)).toStrictEqual({
            error: true,
            payload,
            type: type,
        });
    });
});
