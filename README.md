# Advanced React

### Starting From Scratch (Not using create-react-app)

1. `mkdir lib` - Shared between server and client (for server side rendering)
2. Eventually, we will create multiple nodes for the app in production (and balance the nodes)
3. Every node will be a web server to begin with. Every server node will serve static content and public assets.
4. The public assets will contain the react application: `mkdir public`
5. Create your server.js file inside lib: `touch lib/server.js`. Server will have our express application.
6. Initialize the package as a node file: `yarn init`. Set entry point: `lib/server.js`

### Configuring ESLint & Prettier

1. Bring in a local eslint with `yarn add --dev eslint`
2. Paste the `.eslintrc.js` for babel-eslint (ES6)
3. `yarn add --dev eslint-plugin-react babel-eslint` to install the necessary plugins
4. `yarn add --dev prettier-eslint` - This configures Prettier to format our code based on ESLint rules
5. Ensure the following settings inside your vs code workspace settings -
   a. "editor.formatOnSave": true,
   b. "javascript.format.enable": false,
   c. "prettier.eslintIntegration": true
6. Test whether ESLint is checking for errors
