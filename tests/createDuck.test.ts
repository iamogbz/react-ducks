import { createDuck } from "src";

describe("createDuck", () => {
    const initialState = {
        listOfIds: [1, 2, "3"],
    };
    const fakeAction = jest.fn((state, action) => {
        state.listOfIds.push(action.payload);
        return state;
    });
    const testDuck = createDuck({
        actionMapping: {
            mappedActionName: "actionName",
        },
        initialState,
        name: "duckName",
        reducers: {
            actionName: fakeAction,
        },
    });
    it("creates duck with all properties", () => {
        expect(testDuck).toMatchSnapshot();
        expect(testDuck.actions.actionName?.type).toStrictEqual(
            "duckName/actionName",
        );
    });

    it("does not mutate initial state", () => {
        const initialListOfIds = [...initialState.listOfIds];
        const newState = testDuck.reducer(
            initialState,
            testDuck.actions.actionName!("four"),
        );
        expect(initialListOfIds).toStrictEqual(initialState.listOfIds);
        expect(initialListOfIds).not.toStrictEqual(newState.listOfIds);
        expect(newState.listOfIds).toStrictEqual([1, 2, "3", "four"]);
    });
});
