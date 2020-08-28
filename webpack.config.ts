import * as webpack from "webpack"
import { resolve } from "path"
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default <webpack.Configuration>{
    target: "node",
    mode: "production",
    entry: "./src/index.ts",
    output: {
        filename: "index.js",
        path: resolve("./lib"),
        publicPath: "/"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ["node_modules", "./src"]
    },
    //externals: ["react"],
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
        })
    ]
};