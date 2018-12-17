# Advanced React Notes

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

### Creating a basic express server app

```javascript
//===========================================
// import dependencies
//===========================================
import express from "express";
import config from "./config";

//===========================================
// bring in application
//===========================================
const app = express();

//===========================================
// have express statically serve up the public directory
//===========================================
app.use(express.static("public"));

//===========================================
// create index route at /
// pass in a 'test' variable: "Hello world"
//===========================================
app.get("/", (req, res) => {
    res.render("index", {
        test: "Hello world"
    });
});

//===========================================
// configure express to use ejs as the templating language
//===========================================
app.set("view engine", "ejs");

//===========================================
// set up the app to listen on config.port
//===========================================
app.listen(config.port, () =>
    console.info(`Listening on PORT ${config.port}. . .`)
);
```

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

### Working with Data

1. Get wget (if you don't have it) using `brew install wget`
2. Use `wget -O` to get some test data from some API
3. Note that our test data has authors and articles stored as arrays.
   Arrays are easier to work with when we list records, but when we need to find elements in a collection, arrays are not the best structure. Objects are much better in these scenarios
4. So we want to have a data transform layer between the API and the React Application to convert the articles and authors array into objects.
5. One complexity that we will be working with in the React side of things will be to map authors to articles based on the relational id provided in the data structure.

```json
{
    "data": {
        "articles": [
            {
                "id": "95c12a8f6c88953ca8f8a39da25546e6",
                "title": "Introducing React's Error Code System",
                "date": "Mon Jul 11 2016 00:00:00 GMT+0000 (UTC)",
                "authorId": "2c6aa2cfe3449467d329fa17d6ea230f",
                "body": "Building a better developer experience has been one of the things that React deeply cares about, and a crucial part of it is to detect anti-patterns/potential errors early and provide helpful error messages when things (may) go wrong. However, most of these only exist in development mode; in production, we avoid having extra expensive assertions and sending down full error messages in order to reduce the number of bytes sent over the wire."
            },
            {
                "id": "cc7781c085cf37aabf120098085ff60c",
                "title": "Mixins Considered Harmful",
                "date": "Wed Jul 13 2016 00:00:00 GMT+0000 (UTC)",
                "authorId": "78ae672985c41fae0ecde0133f41bbfa",
                "body": "“How do I share the code between several components?” is one of the first questions that people ask when they learn React. Our answer has always been to use component composition for code reuse. You can define a component and use it in several other components. \nIt is not always obvious how a certain pattern can be solved with composition. React is influenced by functional programming but it came into the field that was dominated by object-oriented libraries. It was hard for engineers both inside and outside of Facebook to give up on the patterns they were used to."
            },
            {
                "id": "0a9afe5bb4ecbf4f7f1c77611e9bf1f9",
                "title": "Create Apps with No Configuration",
                "date": "Fri Jul 22 2016 00:00:00 GMT+0000 (UTC)",
                "authorId": "78ae672985c41fae0ecde0133f41bbfa",
                "body": "Create React App is a new officially supported way to create single-page React applications. It offers a modern build setup with no configuration. \n\nGetting Starte \nInstallation \nFirst, install the global package:"
            },
            {
                "id": "9b72140f27e62670dd7bdd1a9f61b48e",
                "title": "Relay: State of the State",
                "date": "Fri Aug 05 2016 00:00:00 GMT+0000 (UTC)",
                "authorId": "335fb02ec8f76c8515821ac9f266d276",
                "body": "This month marks a year since we released Relay and we'd like to share an update on the project and what's next. \nA Year In Review \nA year after launch, we're incredibly excited to see an active community forming around Relay and that companies such as Twitter are using Relay in production:"
            },
            {
                "id": "f4ab6de6e61c86f03f6fef46f7c407f1",
                "title": "React v15.5.0",
                "date": "Fri Apr 07 2017 00:00:00 GMT+0000 (UTC)",
                "authorId": "d85577ea34ae50f2dac5347b5219aa23",
                "body": "It's been exactly one year since the last breaking change to React. Our next major release, React 16, will include some exciting improvements, including a complete rewrite of React's internals. We take stability seriously, and are committed to bringing those improvements to all of our users with minimal effort.\n To that end, today we're releasing React 15.5.0."
            }
        ],
        "authors": [
            {
                "id": "d85577ea34ae50f2dac5347b5219aa23",
                "firstName": "Andrew",
                "lastName": "Clark",
                "website": "https://twitter.com/acdlite"
            },
            {
                "id": "2c6aa2cfe3449467d329fa17d6ea230f",
                "firstName": "Keyan",
                "lastName": "Zhang",
                "website": "https://twitter.com/keyanzhang"
            },
            {
                "id": "78ae672985c41fae0ecde0133f41bbfa",
                "firstName": "Dan",
                "lastName": "Abramov",
                "website": "https://twitter.com/dan_abramov"
            },
            {
                "id": "335fb02ec8f76c8515821ac9f266d276",
                "firstName": "Joseph",
                "lastName": "Savona",
                "website": "https://twitter.com/en_JS"
            }
        ]
    }
}
```

### Testing with JEST

Jest is a one-stop testing framework which comes with expectation syntax, mocks, and a powerful runner.

1. To add Jest as a dependency, `yarn add --dev jest`
2. Add a test script to `package.json`: `"test": "jest --watch"`
3. Start the runner with `yarn test`
4. Make sure that your eslint file has jest set to true in env, so that eslint does not throw errors for jest.
5. Create your tests inside the lib folder in a folder called `__tests__`
6. We write a data api interface `DataApi.js` to map the received data to objects. The DataApi class internally handles the conversion of data from arrays int objects.

```javascript
//===========================================
// here, we will design our data api interface
//===========================================
class DataApi {
    constructor(rawData) {
        this.rawData = rawData;
    }
    mapIntoObject = arr => {
        return arr.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});
    };
    getArticles = () => {
        return this.mapIntoObject(this.rawData.articles);
    };

    getAuthors = () => {
        return this.mapIntoObject(this.rawData.authors);
    };
}
export default DataApi;
```

7. Next we have to write our tests in jest which checks if the api is in fact sending us our data as objects. We describe two tests for DataApi as follows. . .

```javascript
import DataApi from "../DataApi";
import { data } from "../testData.json";
const api = new DataApi(data);

describe("DataApi", () => {
    it("exposes articles as an object", () => {
        const articles = api.getArticles();
        const articleId = data.articles[0].id;
        const articleTitle = data.articles[0].title;
        expect(articles).toHaveProperty(articleId);
        expect(articles[articleId].title).toBe(articleTitle);
    });

    it("exposes authors as an object", () => {
        const authors = api.getAuthors();
        const authorId = data.authors[0].id;
        const authorFirstName = data.authors[0].firstName;
        expect(authors).toHaveProperty(authorId);
        expect(authors[authorId].firstName).toBe(authorFirstName);
    });
});
```
