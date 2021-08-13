# HeLx Search Interface

This is a [React](https://reactjs.org/) application that was bootstrapped with  [RENCI/create-renci-app](https://github.com/RENCI/create-renci-app).

# Use Search as a Standalone Application

Visit [helxplatform.github.io/search-ui/](https://helxplatform.github.io/search-ui/).

# Consume Search as a Remote Module

Suppose you have an application called "helx" that will consume this Search UI as a remote module.

## Webpack Config

In the Webpack config for "helx," import `ModuleFederationPlugin` and configure an instance to consume this application as a [module](https://helxplatform.github.io/search-ui/remoteEntry.js), which is transpiled, minified, and production-ready.

In the example Webpack configuration below, we'll give this remote module the name `search`. Additionally, we can specify any shared modules to avoid loading duplicate dependencies.

```js
// webpack.config.js

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  plugins = [
    new ModuleFederationPlugin({
      name: 'helx',
      library: { type: 'var', name: 'helx' },
      remotes: {
        search: 'search',
      },
      shared: {
        'react': { singleton: true, requiredVersion: '^17.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^17.0.0' },
        'antd': { singleton: true, requiredVersion: '^4.16.9' },
      }
    })
  ]
}
```

## Import the remote script

Add a script tag to the main HTML file, probably `index.html`, to grab the remote module. Because Search is deployed to https://helxplatform.github.io/search-ui/, we use this as the root of our import URL.

```html
<script src="https://helxplatform.github.io/search-ui/remoteEntry.js"></script>
```

## Import and use the module

Now, within the "helx" application itself, this search module can be consumed. For example, if "helx" is a React application, one could use `React.lazy` along with `import()`, as follows:

```js
// app.js

const SearchUI = React.lazy(() => import('search/App'))
```

Notice that `search` is the main import, which aligns with `remotes: { search: 'search' }` in the "helx" Webpack config, and `App` aligns with the name defined in [_this_ module's Webpack config](https://github.com/helxplatform/search-ui/blob/main/webpack.config.js#L22).

## Bootstrap

From the [Webpack documentation](https://webpack.js.org/concepts/module-federation/), it is recommended to use an asynchronous boundary to split the initialization code of a larger chunk to avoid additional round trips and improve performance.

This means to move the contents of `index.js` to a file named `bootstrap.js` and import that into `index.js`

**index.js**

```diff
- import React from 'react';
- import ReactDOM from 'react-dom';
- import App from './App';
- ReactDOM.render(<App />, document.getElementById('root'));
+ import('./bootstrapjs')
```

**boostrap.js**
```diff
+ import React from 'react';
+ import ReactDOM from 'react-dom';
+ import App from './App';
+ ReactDOM.render(<App />, document.getElementById('root'));
```

# Development

Serve the development server on port 8080:

```shell
npm start
```

# Production

Export production bundle to `./dist` directory:

```shell
npm run build
```