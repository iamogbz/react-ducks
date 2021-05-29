export default {
    coverageDirectory: "./artifacts/coverage",
    coveragePathIgnorePatterns: [
        "<rootDir>/node_modules",
        "<rootDir>/tests",
        "<rootDir>/e2e",
    ],
    moduleDirectories: ["./node_modules", "<rootDir>/node_modules", "."],
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["./artifacts/", "./dist/", "./node_modules/"],
};
