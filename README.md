# Advanced React

### Starting From Scratch (Not using create-react-app)

1. `mkdir lib` - Shared between server and client (for server side rendering)
2. Eventually, we will create multiple nodes for the app in production (and balance the nodes)
3. Every node will be a web server to begin with. Every server node will serve static content and public assets.
4. The public assets will contain the react application: `mkdir public`
5. Create your server.js file inside lib: `touch lib/server.js`. Server will have our express application.
6. Initialize the package as a node file: `yarn init`. Set entry point: `lib/server.js`

### Configuring ESLint with Prettier

1. Bring in a local eslint with `yarn add --dev eslint`
2. Paste content from `.eslintrc.js` for babel-eslint (ES6)
3. `yarn add --dev eslint-plugin-react babel-eslint` to install the necessary plugins
4. `yarn add --dev prettier-eslint` - This configures Prettier to format our code based on ESLint rules
5. Ensure the following settings inside your vs code workspace settings -
   a. "editor.formatOnSave": true,
   b. "javascript.format.enable": false,
   c. "prettier.eslintIntegration": true
6. Test whether ESLint is checking for errors

### pm2 dependency

1. Basically like nodemon but better suited for production
2. `yarn add pm2` - to bring in the dependency
3. Pros in production: rendering a cluster instead of a single node, zero downtime restarts, etc.
4. Add a script to `package.json`: `"dev": "pm2 start lib/server.js --watch"`
5. Start the server in the background (so cool) with `yarn dev`
6. To see logs for the process using `yarn pm2 logs`

### Get Babel working on server side (OMG XD)

We need to get babel configured because our server side will eventually render the react application.
So we need the server side to understand the jsx syntax along with ES6 stuff.

1. Add babel key to package.json and add the following presets - `"presets": ["react", "env", "stage-2"]`
   stage-2 lets you use class properties which are en-route to becoming part of the language.
2. Add dependencies - `yarn add babel-cli` - This gives you babel node (\*\_\*)
3. Change config of pm2 to tell it to use babel node instead of regular node. Just add `--interpreter babel-node` option to dev script.
4. Add preset dependencies: `yarn add babel-preset-react babel-preset-env babel-preset-stage-2`
5. You can now use ES6 server side. Yay!

### Creating your first server side component in React (using Webpack)

1. Create a basic component inside `lib/components/Index.js` file

```javascript
import React from "react";
import ReactDOM from "react-dom";

const App = () => <h2>Hello React</h2>;

ReactDOM.render(<App />, document.getElementById("root"));
```

2. Add the root div to `index.ejs` along with a script to load the react file

```html
<div id="root">Loading. . .</div>
<script src="bundle.js"></script>
```

3. We use `bundle.js` here since its a better option to use one bundled script than many individual ones (using webpack of course)

4. Bring in the dependencies: `yarn add react react-dom webpack`

5. Now, webpack needs to know where to start and where to place our `bundle.js` file. Create `webpack.config.js` file on the root level.

6. For more info on how to use webpack, refer the `https://webpack.js.org/` documentation.

7. Copy the webpack.config.js file. It needs a dependency of babel-loader.

8. You need to add babel-loader dependency but the latest one needs @babel-core dependency or something like that. Instead add babel-loader@7 using the command `yarn add babel-loader@7`

9. Add the following script: `"webpack": "webpack -wd"` and run it

10. Test the application to check if webpack has been configured correctly.

Note: If you run `time yarn webpack` to measure how much time it takes for webpack to create your build without the excludes node modules regex, you will notice that it's pretty slow. This is because our webpack.config.js (in its rules section) asks webpack to build everything that ends with `.js` and this includes everything from node modules as well.
So, don't forget to add the excludes node_modules part.

Also note that, we need to add babel-polyfill in entry along with adding it as a dependency `yarn add babel-polyfill` because without this configuration, async await functions dont work and they throw a regenerator run time error
