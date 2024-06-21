import sucrase from '@rollup/plugin-sucrase';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const dist_name = "dist";

const plugins = [
    sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript']
    }),
    nodeResolve({
        preferBuiltins: true
    }),
    commonjs(),
    terser()
]

export default [
    {
        input: "index.ts",
        output: [
            {
                file: `${dist_name}/index.js`,
                format: "cjs",
            },
            {
                file: `${dist_name}/index.mjs`,
                format: "esm",
            },
        ],
        plugins: [
            ...plugins,
        ]
    },
    {
        input: "./lib/injections/background.ts",
        output: {
            format: "iife",
            file: "build/injections/background.js"
        },
        plugins,
        external: ['fs', 'path']
    },
    {
        input: "./lib/injections/content.ts",
        output: {
            format: "iife",
            file: "build/injections/content.js"
        },
        plugins,
        external: ['fs', 'path']
    },
]
