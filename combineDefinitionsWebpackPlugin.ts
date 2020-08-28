import { Options } from "dts-bundle";
import { Compiler } from "webpack";

//TODO: NPM this for re-use
export default class CombineDefinitionsWebpackPlugin {
    constructor(readonly options: Options) {
    }

    public apply(compiler: Compiler) {
        compiler.hooks.done.tapPromise("CombineDefinitionsWebpackPlugin", async () => {
            const dts = await import("dts-bundle");
            dts.bundle(this.options);
        });
    }
}