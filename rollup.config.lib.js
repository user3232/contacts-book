// import pkg from './package.json' with {type: 'json'}
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { defineConfig } from 'rollup'

export default defineConfig({
    input: {
        main: 'lib/index.ts',
    },
    plugins: [
        typescript({
            // needed because plugin needs tsconfig directory..
            tsconfig: 'tsconfig.lib.json',
            // typescript plugin reads files only this way:
            "include": [
                "lib/**", 
                "mime-map.json", 
                "package.json"
            ],
        }),
        json(),
    ],
    output: {
        dir: 'dist/server',
        format: 'esm',
    }
})
