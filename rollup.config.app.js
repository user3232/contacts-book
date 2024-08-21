// import pkg from './package.json' with {type: 'json'}
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { defineConfig } from 'rollup';


export default defineConfig({
    input: {
        main: 'src/main.tsx'
    },
    plugins: [
        typescript({
            tsconfig: 'tsconfig.app.json',
            // typescript plugin reads files only this way:
            include: [
                "src/**",
                "mime-map.json",
                "package.json",
            ]
        }),
        nodeResolve(),
        commonjs(),
        replace({
            preventAssignment: false,
            'process.env.NODE_ENV': '"development"', 
        }),
    ],
    output: {
        dir: 'dist/browser',
        format: 'esm',
    }
})