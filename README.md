# HeLx Search Interface

This is a [React](https://reactjs.org/) application that was bootstrapped with  [RENCI/create-renci-app](https://github.com/RENCI/create-renci-app).

# Use Search as a Standalone Application

Visit [helxplatform.github.io/search-ui/](https://helxplatform.github.io/search-ui/).

# Consume Search as a Remote Module

Suppose you have an application called "helx" that will consume this Search UI as a remote module. In the Webpack config for helx, import `ModuleFederationPlugin` and configure an instance to consume `remoteEntry.js` from "helx".

In the configuration example below, we'll name this remote module `search`. Additionally, we can specify shared modules to prevent loading duplicate dependencies.

```js
// webpack.config.js

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  plugins = [
    new ModuleFederationPlugin({
      name: 'helx',
      library: { type: 'var', name: 'helx' },
      filename: 'remoteEntry.js',
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

Then in the "helx" application, this search module can be consumed. For example, if "helx" is a React application, one could use `React.lazy` along with `import()`, as follows:

```js
const SearchUI = React.lazy(() => import('search/App'))
```

Notice that `search` is the main import, which aligns with `remotes: { search: 'search' }` in the "helx" Webpack config, and `App` aligns with the name defined in [_this_ module's Webpack config](https://github.com/helxplatform/search-ui/blob/main/webpack.config.js#L22).

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