import config from "./jest.config";

export default {
    ...config,
    moduleNameMapper: {
        "src(.*)": "<rootDir>/dist$1",
    },
};
