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
