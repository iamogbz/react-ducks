import { createAction } from "src";

describe("createAction", () => {
    it("creates action with prepared payload", () => {
        const type = "expectedType";
        const payload = "expectedPayload";
        const actionCreator = createAction(type, (payload) => ({
            type: "shouldBeOverwritten",
            payload,
            error: true,
        }));
        expect(actionCreator(payload)).toEqual({
            error: true,
            payload,
            type: type,
        });
    });
});
