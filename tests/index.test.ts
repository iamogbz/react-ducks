import { GlobalContext } from "src/components/Context";
import { Provider } from "src/components/Provider";
import { applyMiddleware } from "src/utils/applyMiddleware";
import { createAction } from "src/createAction";
import { createContext } from "src/createContext";
import { createDuck } from "src/createDuck";
import { createReducer } from "src/createReducer";
import { createRootDuck } from "src/createRootDuck";
import { createRootProvider } from "src/createRootProvider";
import { useDispatch } from "src/hooks/useDispatch";
import { useSelector } from "src/hooks/useSelector";

describe("api", () => {
    it("export api from src/index", () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        expect(require("src")).toMatchObject({
            GlobalContext,
            Provider,
            applyMiddleware,
            createAction,
            createContext,
            createDuck,
            createReducer,
            createRootDuck,
            createRootProvider,
            useDispatch,
            useSelector,
        });
    });
});
