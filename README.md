<p align="center">
  <img src="https://raw.githubusercontent.com/juxtacode/vscode-jest-debugger/master/public/icon2.png?raw=true" alt="Jest Debugger: Debug tests with NPM, PNPM or Yarn (with or without PnP enabled)." width="150">
  <br>
</p>
<p align="center">Jest Debugger: Debug tests with NPM, PNPM or Yarn (with or without PnP enabled).</p>

# Jest Debugger

## Visual Studio Code Marketplace

[VisualStudio Marketplace](https://marketplace.visualstudio.com/items?itemName=juxtacode.vscode-jest-debugger)  

## Comparison with [vscode-jest-runner](https://github.com/firsttris/vscode-jest-runner)

[Jest Debugger](https://github.com/juxtacode/vscode-jest-debugger) is focused on running or debugging specific test or test-suite using any package manager which it can auto-detect. It also automatically finds your Yarn version on any platform, while [Jest Runner](https://github.com/firsttris/vscode-jest-runner) does not automatically find your package manager or Yarn implementation on every platform.

## Features

Simple way to run or debug a specific test
_As it is possible in IntelliJ / Webstorm_

Run & Debug your Jest Tests from

- Context-Menu
- CodeLens
- Command Palette (ctrl+shift+p or cmd+shift+p)

## Supports

- yarn & vscode workspaces (monorepo)
- dynamic jest config resolution
- yarn 2+ PnP
- CRA & and similar abstractions

![Extension Example](https://github.com/juxtacode/vscode-jest-debugger/raw/main/public/vscode-jest-debugger.gif)

## Usage with CRA or similar abstractions

add the following command to settings, to pass commandline arguments

```
"jestdebugger.jestCommand": "npm run test --"
```

## Debugging JSX/TSX with CRA

for debugging JST/TSX with CRA you need to have a valid babel and jest config:

to add a `babel.config.js` with at least the following config

```
// babel.config.js
module.exports = {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "babel-preset-react-app",
    ],
  };
```

add a `jest.config.js` with at least the following config

```
module.exports = {
  transform: {
    '\\.(js|ts|jsx|tsx)$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|ico|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|webmanifest|xml)$':
      '<rootDir>/jest/fileTransformer.js'
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy'
  },
}
```

## Extension Settings

Jest Debugger will work out of the box, with a valid Jest config, however, you can use the following settings to configure Jest Debugger:


| Command                                     | Description                                                                                                                        |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| jestdebugger.configPath                     | Jest config path (relative to ${workFolder} e.g. jest-config.json)                                                                 |
| jestdebugger.jestPath                       | Absolute path to jest bin file (e.g. /usr/lib/node_modules/jest/bin/jest.js)                                                       |
| jestdebugger.debugOptions                   | Add or overwrite vscode debug configurations (only in debug mode) (e.g. `"jestdebugger.debugOptions": { "args": ["--no-cache"] }`) |
| jestdebugger.runOptions                     | Add CLI Options to the Jest Command (e.g. `"jestdebugger.runOptions": ["--coverage", "--colors"]`) https://jestjs.io/docs/en/cli   |
| jestdebugger.jestCommand                    | Define an alternative Jest command (e.g. for Create React App and similar abstractions)                                            |
| jestdebugger.disableCodeLens                | Disable CodeLens feature                                                                                                           |
| jestdebugger.codeLensSelector               | CodeLens will be shown on files matching this pattern (default \*_/_.{test,spec}.{js,jsx,ts,tsx})                                  |
| jestdebugger.codeLens                       | Choose which CodeLens to enable, default to `["run", "debug"]`                                                                     |
| jestdebugger.enableYarnPnpSupport           | Enable if you are using Yarn 2 with Plug'n'Play                                                                                    |
| jestdebugger.changeDirectoryToWorkspaceRoot | Changes directory to workspace root before executing the test                                                                      |
| jestdebugger.preserveEditorFocus            | Preserve focus on your editor instead of focusing the terminal on test run                                                         |
| jestdebugger.runLabel                       | Change the label of the Run command in the text editor                                                         |
| jestdebugger.debugLabel                     | Change the label of the Debug command in the text editor                                                         |

## Shortcuts

click File -> Preferences -> Keyboard Shortcuts -> "{}" (top right)
the json config file will open
add this:

```javascript
{
  "key": "alt+1",
  "command": "extension.runJest"
},
{
  "key": "alt+2",
  "command": "extension.debugJest"
},
{
  "key": "alt+3",
  "command": "extension.watchJest"
},
```

## Want to start contributing features?

[Some open topics get you started](https://github.com/juxtacode/vscode-jest-debugger/issues)

## Steps to run in development mode

- npm install
- Go to Menu "Run" => "Start Debugging"

Another vscode instance will open with the just compiled extension installed.

## Notes from contributors

- Babel compile Issue when starting Debug in JSX/TSX,

  - check the post of @Dot-H https://github.com/firsttris/vscode-jest-runner/issues/136
  - https://github.com/firsttris/vscode-jest-runner/issues/174

- By default **Jest** finds its config from the `"jest"` attribute in your `package.json` or if you export an object `module.export = {}` in a `jest.config.js` file in your project root directory.  
  Read More: [Configuring Jest Docs](https://jestjs.io/docs/en/configuration)

- If Breakspoints are not working properly, try adding this to vscode config:

```javascript
"jestdebugger.debugOptions": {
    "args": ["--no-cache"],
    "sourcemaps": "inline",
    "disableOptimisticBPs": true,
}
```
# vscode-jest-debugger
