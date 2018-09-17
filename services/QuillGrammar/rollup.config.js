import path from 'path';

import commonjs from 'rollup-plugin-commonjs';
import packageJson from 'rollup-plugin-generate-package-json';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

import pkg from './package.json';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

const libraryName = 'quill-grammar',
    globalLibs = {
        "classnames": "classnames",
        "antd": "antd"
    },
    externalLibs = [
        'classnames',
        'antd',
        'tslib'
    ];

export default {
    input: 'src/App.tsx',
    output: [{
        external: externalLibs,
        file: `dist/${pkg.main}`,
        format: 'umd',
        globals: globalLibs,
        name: libraryName
    }, {
        external: externalLibs,
        file: `dist/${pkg.module}`,
        format: 'es',
        globals: globalLibs,
        name: libraryName
    }],
    plugins: [
        postcss({
            modules: true
        }),
        tslint({
            exclude: '!./src/**/*.tsx?',
            include: './src/**/*.tsx?'
        }),
        typescript({
            clean: true,
            typescript: require('typescript'),
            verbosity: 0,
            abortOnError: false
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
              'node_modules/prop-types/index.js': ['bool', 'object', 'string', 'func', 'oneOfType', 'array', 'shape', 'element', 'arrayOf'],
              'node_modules/react/react.js': ['createElement'],
              'node_modules/react-dom/index.js': ['findDOMNode', 'render', 'createPortal', 'unmountComponentAtNode'],
              'node_modules/react/index.js': ['createElement', 'Component', 'Children', 'cloneElement', 'isValidElement', 'PureComponent'],
              'node_modules/quill-component-library/dist/componentLibrary.js': ['hashToCollection', 'ConceptExplanation', 'Modal', 'ArchivedButton', 'FlagDropdown', 'ResponseSortFields', 'ResponseToggleFields', 'QuestionBar', 'AffectedResponse'],
              'node_modules/lodash/lodash.js': ['values', 'flatten', 'compact', 'pickBy', 'cloneDeep'],
              'node_modules/draft-js/lib/Draft.js': ['Editor', 'EditorState', 'ContentState', 'KeyBindingUtil', 'Modifier', 'DefaultDraftBlockRenderMap', 'CompositeDecorator', 'getDefaultKeyBinding', 'DefaultDraftInlineStyle', 'genKey', 'CharacterMetadata', 'ContentBlock', 'convertFromHTML', 'BlockMapBuilder'],
              'node_modules/underscore/underscore.js': ['values', 'mapObject', 'each', 'isEqual', 'indexBy'],
              'node_modules/rc-editor-mention/lib/index.js': ['toString'],
              'node_modules/immutable/dist/immutable.js': ['List', 'Map', 'OrderedSet', 'is', 'fromJS', 'Repeat']
            }
        }),
        resolve({
            // pass custom options to the resolve plugin
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            },
            browser: true,
        }),
        packageJson({
            // By default, the plugin searches for package.json file.
            // Optionally, you can specify its path
            inputFile: path.resolve(__dirname, './package.json'),

            // Set output folder, where generated package.json file will be saved
            outputFolder: path.resolve(__dirname, './dist'),

            // Optionally, you can set base contents for your generated package.json file
            baseContents: {
                "name": pkg.name,
                "version": pkg.version,
                "description": pkg.description,
                "main": pkg.main,
                "module": pkg.module,
                "homepage": pkg.homepage,
                "author": pkg.author,
                "license": pkg.license,
                "repository": pkg.repository,
                "bugs": pkg.bugs,
                "dependencies": pkg.peerDependencies,
                "private": false
            }
        }),
        json()
    ]
};
