import { execSync } from "child_process";
import { Configuration } from "webpack";
import { WebpackCompilerPlugin } from "webpack-compiler-plugin";

const isProd = process.env.NODE_ENV !== "development";
const tsConfig = `tsconfig${isProd ? ".prod" : ""}.json`;

const configuration: Configuration = {
    devtool: !isProd && "source-map",
    entry: {},
    mode: isProd ? "production" : "development",
    plugins: [
        new WebpackCompilerPlugin({
            listeners: {
                buildStart: () => execSync("npm run clean"),
                compileStart: () => execSync(`tsc --project ${tsConfig}`),
            },
            name: "webpack-compiler",
        }),
    ],
    target: "node",
    watchOptions: {
        ignored: /dist|node_modules/,
    },
};

export default configuration;
