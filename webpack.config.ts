import * as webpack from "webpack";
import { resolve, join } from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const
    { name: packageName } = require("./package.json"),
    outDir = resolve("./lib") ;

export default <webpack.Configuration>{
    target: "node",
    mode: "production",
    entry: "./src/index.ts",
    output: {
        filename: "index.js",
        path: outDir,
        publicPath: "/",
        library: packageName,
        libraryTarget: "umd", 
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ["node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/i,
                include: resolve("./src"),
                use: {
                    loader: "ts-loader",
                    options: {
                        onlyCompileBundledFiles: true,
                        configFile: resolve("./tsconfig.json")
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: false,
            protectWebpackAssets: true,
            cleanStaleWebpackAssets: true,
            cleanOnceBeforeBuildPatterns: [
                resolve("./lib/**/*.*"),
                resolve("./dist/**/*.*")
            ]
        }),
        new webpack.ProvidePlugin({
            "React": "react"
        }),
        // bundle definitions when done plugin
        {
            apply: compiler => compiler.hooks.done.tap("D.TS", () => require("dts-bundle").bundle({
                name: packageName,
                main: join(outDir, "index.d.ts"),
                out: join(outDir, "index.d.ts"),
                removeSource: true,
                outputAsModuleFolder: true
            }))
        }
    ]
};
