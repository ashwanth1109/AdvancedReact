# Advanced React Notes (Fullstack Applications with Isomorphic React)

My notes on Samer Buna's `Advanced React.js` course on Pluralsight

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

### Creating a basic server side component in React

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

### Creating the front end for the data

In our App.js, we get the API data and after parsing it using our DataApi class,
we store it in state and render it using the ArticleList component -

```javascript
import React, { Component } from "react";
import ArticleList from "./ArticleList";

import DataApi from "../DataApi";
import { data } from "../testData";
const api = new DataApi(data);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: api.getArticles(),
            authors: api.getAuthors()
        };
    }
    render() {
        const { articles, authors } = this.state;
        return <ArticleList articles={articles} authors={authors} />;
    }
}

export default App;
```

Our ArticleList component iterates through the articles array and renders each Article using the Article component -

```javascript
import React from "react";
import Article from "./Article";

const ArticleList = ({ articles, authors }) => {
    return (
        <div>
            {Object.values(articles).map(article => (
                <Article
                    key={article.id}
                    article={article}
                    author={authors[article.authorId]}
                />
            ))}
        </div>
    );
};

export default ArticleList;
```

Our Article component renders the details of the Article such as title, date and body along with the author information such as firstName, lastName and website.

```javascript
import React from "react";

const Article = ({ article, author }) => {
    return (
        <div>
            <div>{article.title}</div>
            <div>{article.date}</div>
            <div>
                <a href={author.website}>
                    {author.firstName} {author.lastName}
                </a>
            </div>
            <div>{article.body}</div>
        </div>
    );
};

export default Article;
```

Given that Article and ArticleList are dumb presentational components, we obviously choose to render them as stateless components.

### Styling the Article component using React's Javascript API for inline styles

```javascript
//===========================================
// javascript api for css styles in react using the style attribute on divs
//===========================================
const s = {
    article: {
        paddingBottom: 10,
        borderBottomStyle: "solid",
        borderBottomColor: "#aaa",
        borderBottomWidth: 1,
        marginBottom: 10
    },
    title: {
        fontWeight: "bold"
    },
    date: {
        fontSize: "0.85em",
        color: "#888"
    },
    author: {
        paddingTop: 10,
        paddingBottom: 10
    },
    body: {
        paddingLeft: 20
    }
};
```

It is important to note that we declare the styles as a global object and not inside the class component, because it would then create the style object multiple times for every re-render.
In the final stage of production, one optimization could be to put it into its own module for storing all the styles in one place.

### Working with Dates

In this scenario instead of displaying the timestamp, we want a readable string for date.
So, we can create a function by working with Javascript's date objects -

```javascript
const dateDisplay = dateString => new Date(dateString).toDateString();
```

Note that since this function has nothing specific to the Article component, it is better to place it as a global function since we dont want React to create this function for every render.

Note that, if you NEED to create a function inside a stateless component (for example, if it needs to use props), it is a better idea to create one using class (making it a stateful component) or see if you can make it work by passing it in as a parameter while keeping the function in global scope.

### Thinking about Component Responsibilities

The ArticleList component is smarter than it needs to be.

```javascript
const ArticleList = ({ articles, authors }) => {
    return (
        <div>
            {Object.values(articles).map(article => (
                <Article
                    key={article.id}
                    article={article}
                    author={authors[article.authorId]}
                />
            ))}
        </div>
    );
};
```

It has information about authors which it then passes down to the Article component. The problem with this approach is that by creating this dependency, if we have to change something about the information being passed down, we would have to unnecessarily make changes at the ArticleList level as well. Instead, it is better to manage this action of looking up authors in the higher level (in this case, App component). Generally, we should keep children component less smart by making them purely presentational components, and have parent components smarter (control logic of things) and manage the state of the application.

```javascript
// App
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: api.getArticles(),
            authors: api.getAuthors()
        };
    }

    articleActions = {
        // we create an article actions object
        lookupAuthor: authorId => this.state.authors[authorId] // it has a lookup function that we pass down to ArticleList
    };

    render() {
        const { articles } = this.state;
        return (
            <ArticleList
                articles={articles}
                articleActions={this.articleActions}
            />
        );
    }
}

// ArticleList
const ArticleList = ({ articles, articleActions }) => {
    return (
        <div>
            {Object.values(articles).map(article => (
                <Article
                    key={article.id}
                    article={article}
                    actions={articleActions} // Article is not aware of what articleActions are doing
                />
            ))}
        </div>
    );
};

// Article
const Article = ({ article, actions }) => {
    const author = actions.lookupAuthor(article.authorId); // lookup author using the passed down action
    return (
        <div style={s.article}>
            <div style={s.title}>{article.title}</div>
            <div style={s.date}>{dateDisplay(article.date)}</div>
            <div style={s.author}>
                <a href={author.website}>
                    {author.firstName} {author.lastName}
                </a>
            </div>
            <div style={s.body}>{article.body}</div>
        </div>
    );
};
```

We have made the above changes to our components because, the Article component is the one that has the authorId information needed to look up the Author and the App component is the one that has information to look up the author based on an authorId. So, by passing the lookupAuthor function from App to Article, we remove the dependency of ArticleList in terms of having any author information and it doesnt have to care about what's inside articleActions.

### JEST Snapshot Testing

There are two major types of tests that we do with JEST -

(1) normal tests that test logic in code (2) Jest snapshot testing

For snapshot testing,

1. Add a `__tests__` folder inside your components folder.
2. In order to start testing a component, we have to understand the dependencies of the component.
3. For this sort of tests, we will use a package called react-test-renderer - `yarn add --dev react-test-renderer`
4. Then we write a test for the component - in this case, for the ArticleList component.
5. Our ArticleList has the following dependencies. It expects an array of articles, and inside each article, it expects an article id, and an articleActions object.
6. We have to fake this dependency so that we can smoke test this component.
7. So, create an `ArticleListTest.js` inside the `__tests__` folder inside components.
8. Here, we also need the `react-test-renderer` library. This is the library we use to create the React components snapshots.
9. For this, we describe the ArticleList component and we want to make sure that it renders correctly by creating a testProps object and passing it into the ArticleList component.
10. We then pass in this component into the renderer which gives us a ReactTestInstance.
11. The ReactTestInstance has more info than we need, so we gonna cut it down using `toJSON()` method.
12. `toJSON()` will give you the actual object representation of the component in the form of a tree.
13. Now we can write our expectations and test to see if anything has changed in comparison to previous snapshot (created the first time you run it).

```javascript
import React from "react";
import ArticleList from "../ArticleList"; // this is component that we're testing

import renderer from "react-test-renderer";

describe("ArticleList", () => {
    const testProps = {
        articles: {
            a: { id: "a" },
            b: { id: "b" }
        },
        articleActions: {
            lookupAuthor: jest.fn(() => ({}))
        }
    };

    it("renders correctly", () => {
        const tree = renderer.create(<ArticleList {...testProps} />).toJSON();

        expect(tree.children.length).toBe(2);
        //===========================================
        // snapshot expectations
        //===========================================
        expect(tree).toMatchSnapshot();
    });
});
```

### Server Side Rendering of the React Application

Side note: https://stackoverflow.com/questions/46516395/whats-the-difference-between-hydrate-and-render-in-react-16
Apparently, hydrate is the more performant variant for render. Read docs.
https://reactjs.org/docs/react-dom.html#hydrate

Note that if javascript is disabled on the browser (`Settings => Preferences => Debugger => Disable Javascript` ), our application will only render the `Loading . . .` part from the index ejs file. Search engines when indexing this application can only see this portion of our application. To fix this problem, by rendering the exact same react application on the server as well. By doing this -

(1) we get search engine optimization
(2) we get a performance benefit because when we are mounting React on the client side, the browser will already have a copy of the application, and can just use those components as is.

For the current state of the app, server rendering is less complicated since we don't have any async data yet.

1. In `index.ejs`, instead of rendering our `Loading . . .` text, we will insert an HTML string that will contain the React rendering of the application - `<div id="root"><%- initialContent -%></div>`
   Note - Make sure that there are no spaces between the root div tags and the `initialContent` variable. This is because when rendering the application on the client side, React computes the differences between the DOM and the virtual DOM before making the necessary updates. And this is space sensitive.
2. In `server.js`, we pass in our initialContent variable which gets the HTML string from another file using a function, which we will call `serverRender()` below. Dont forget to import this function from the file.

```javascript
app.get("/", (req, res) => {
    const initialContent = serverRender();
    res.render("index", {
        initialContent
    });
});
```

3. We can render our Application as a string using the following `serverRender()` function.

```javascript
import React from "react";
import ReactDOMServer from "react-dom/server"; // This lets you render a React application into a string

import App from "./components/App";

const serverRender = () => {
    return ReactDOMServer.renderToString(<App />);
};

export default serverRender;
```

Note: Now, if you check the rendering of the application without javascript, you will be able to see the entire application being rendered from server-side.

### Understanding the performance improvement of Isomorphic Applications

1. Change app back to initial way of rendering (only client side) with only the Loading text showing up from server.
2. In chrome, we have to simulate a slow CPU.
3. `Disable cache` in network tab.
4. In the performance tab, click on settings, choose CPU throttling as 20x slowdown.
5. Monitor network tab
6. On refreshing this page, we can see how the CPU takes a while to render the content and only the Loading... message is shown during that load time.
7. If instead, you ship the initial HTML as a string, and refresh the page, you will see the content render from the server, even when the webpage is still loading to run client side scripts.

(# mind === blown #)

### Refactoring - Red, Green states of code

A green state is when your code works and tests pass (although we dont have great test coverage yet).
Factors that indicate a green state are -

1. The application rendering correctly in the browser without any console errors.
2. Webpack is rendering correctly.
3. pm2 watch logs are not throwing any errors
4. App passes all the JEST tests

Red state is when you have failing tests in any of these cases.

CRITICAL RULE: Only refactor when your code is in the green state (as obvious as this seems, its crucial to remind yourself of this stuff)

REFACTORING CODE -

1. Move `Index.js` and `serverRender.js` into their own folder called `renderers`
2. Rename these files to `dom.js` and `server.js` respectively.
3. Account for this move and rename in webpack.config.js and server.js

You can choose to go with absolute require rather than relative require.
To do this, indicate, the NODE_PATH=./lib for indicating absolute requires that start with lib folder.
`"dev": "NODE_PATH=./lib pm2 start lib/server.js --watch --interpreter babel-node"`
For absolute requires to work for webpack, add the following piece of code to webpack.config.js.

Once this is done, you can check the status of the pm2 process using `yarn pm2 list`
You will have to delete this process using `yarn pm2 delete server` and then start a new process using the now modified dev script - `yarn dev`

```js
module.exports = {
    resolve: {
        modules: [path.resolve("./lib"), path.resolve("./node_modules")]
    },
    entry: ["babel-polyfill", "./lib/renderers/dom.js"],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js"
    },
    module: {
        rules: [{ test: /\.js$/, exclude: /node_modules/, use: "babel-loader" }]
    }
};
```

### Publishing your own npm packages - Whoa!!

There is also another advantage to adding NODE_PATH to `package.json` and path.resolve changes to `webpack.config.js`. It makes developing your own npm packages locally a lot easier.

1. Create your package's own git directory.
2. In this case, we just do it inside this project with the DataApi package.
3. `mkdir state-api` inside the lib folder
4. Move the `DataApi.js` file into `state-api/lib` and rename it to `index.js`
5. To make this state-api into its own package, we run `yarn init` inside the state-api folder.
6. Set entry point to `lib/index.js`.
7. Now, the plan is to eventually publish this package when its ready. In production, the state-api will be from this published package.
8. While using this package in development mode, keeping in mind that when you go into production you will not have the state-api directory, we opt to use it as a published package.
9. Just replace your import statements into using published package:

```js
import DataApi from "state-api";
```

This will work locally because of our NODE_PATH and webpack settings as mentioned.
In production, it will work by reading state-api from node_modules when we install state-api as a dependency.

The advantage here is clearly that, you can grow your project both locally as well as in production.

10. Once we have our package ready, we publish it to npm and we push our local project to deploy without using the local state api code and things will just work because its a normal import statement that will read from node_modules.

11. However, remember that before you publish the package, you have to transpile it using Babel, as its a bad idea to publish an npm package that uses features that are not yet in node.

### Asynchronous API on the client side

So far, we have worked with in-memory test data. Obviously, we have to shift that into making API calls in the component.

1. Import your test data into `server.js` and create a get route at the `/data` endpoint

```js
// import test data
import { data } from "./testData";
//
// Expose our test data using /data api route
app.get("/data", (req, res) => {
    res.send(data);
});
```

2. On the client side, we need an ajax library to fetch the data. In this case we are going to use axios.
   `yarn add axios`

3. We can't read the data in the constructor now as we did before bcuz the data is now asynchronous. So we remove the constructor.

```js
constructor(props) { // cant read api data in constructor anymore
    super(props);
    this.state = {
        articles: api.getArticles(),
        authors: api.getAuthors()
    };
}
```

4. We initialize a state object so that the React frontend doesnt throw an undefined error. Then we use async-await on the componentDidMount() lifecycle method to fetch data using axios.

```js
state = {
    articles: {},
    authors: {}
};

async componentDidMount() {
    const response = await axios.get('/data');
    const api = new DataApi(response.data);
    this.setState({
        articles: api.getArticles(),
        authors: api.getAuthors()
    });
}
```

5. Note here that if you `Disable javascript` from the chrome options, we see that the server side rendered component does not fetch the data.

    This is because the componentDidMount() lifecycle method does not run on the server side.
    Side note: Do not use componentWillMount() or constructor for fetching data even though they do it pre-render.
    More info here: https://github.com/facebook/react/issues/12495

### Asynchronous API on the server side

1. Import in axios

```js
import axios from "axios"; // we use axios for server side as well
```

2. We then need to make the initial state of the app server side friendly so that the fetched data can be passed in from the `server.js` renderer into the App component using props.

```js
state = {
    articles: this.props.articles,
    authors: this.props.authors
};
```

3. But this breaks the client side code because the props are not being passed in from the client side app renderer `dom.js`. So make sure we are passing in these props from both client side and server side.

Server Side - `server.js`

```js
const serverRender = () => {
    return ReactDOMServer.renderToString(<App articles={{}} authors={{}} />);
};
```

Client Side - `dom.js`

```js
// On client side, we are passing in empty objects as props in the App component
ReactDOM.render(
    <App articles={{}} authors={{}} />,
    document.getElementById("root")
);
```

4. Now, we need to fetch the data on the server side using axios. Remember to make the serverRender an async function because we await the response from the get request.

```js
import { port, host } from "config"; // importing from config (using an absolute path from lib)
import DataApi from "state-api"; // importing from state-api package

const serverRender = async () => {
    const res = await axios.get(`http://${host}:${port}/data`);
    const api = new DataApi(res.data);

    return ReactDOMServer.renderToString(
        <App articles={api.getArticles()} authors={api.getAuthors()} />
    );
};
```

Note that we can't use `/data` on the server side like we did for the `axios.get('/data')` on the client side. It instead needs to be a `http://${host}:${port}/data` where the host and port are configurable. Our config file now looks like this -

```js
module.exports = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost"
};
```

5. Since the `serverRender()` function is now asynchronous, we have to deal with this in the `server.js` side as well. Modify our get route in the server so that it awaits the serverRender to fetch data and then give us the string format of the HTML. Note that the req, res callback needs to be declared as async.

```js
//===========================================
// create index route at /
//===========================================
app.get("/", async (req, res) => {
    const initialContent = await serverRender();
    res.render("index", {
        initialContent
    });
});
```

6. Now, the application should render the data after fetching from the server side. You should see it even with the `Disable javascript` option on chrome. Note that, if you do have javascript enabled then chrome throws an error. This is because, the initial state on the client side is still an empty object, which means your application is going from rendered content to empty and then back again to the same rendered content. This is pretty wasteful and inefficient because we're throwing away the DOM we need to render something else and then replace it with the exact same DOM from before.
