# Graasp Player

## Installation

1. Run `yarn` to install the dependencies
2. Run the API at `localhost:3000`
3. Set the following environnement variables in `.env.development`

```sh
VITE_PORT=3112
VITE_GRAASP_API_HOST=http://localhost:3000
VITE_GRAASP_AUTH_HOST=http://localhost:3001
VITE_GRAASP_BUILDER_HOST=http://localhost:3111
VITE_GRAASP_LIBRARY_HOST=http://localhost:3005
VITE_SENTRY_ENV=development
VITE_H5P_INTEGRATION_URL=
VITE_SHOW_NOTIFICATIONS=true
```

4. Run `yarn start`. The client should be accessible at `localhost:3112`

## Testing

The tests are run using Cypress. Cypress only compiles the code for the tests, your app needs to run at the specified `baseUrl` in the cypress config.

### Running tests in interactive mode

Set the following environnement variables in `.env.test`

```sh
VITE_PORT=3112
VITE_GRAASP_API_HOST=http://localhost:3000
VITE_GRAASP_AUTH_HOST=http://localhost:3001
VITE_GRAASP_BUILDER_HOST=http://localhost:3111
VITE_GRAASP_LIBRARY_HOST=http://localhost:3005
VITE_H5P_INTEGRATION_URL=
VITE_SHOW_NOTIFICATIONS=false
```

Run `yarn start:test` and `yarn cypress:open` in 2 terminal windows.

:warning: It is possible that the websocket test become flacks (or just stop passing) if you use the dev server. In that case, you can resort to first building the app in test mode `yarn build:test` and then starting a preview of the app with `yarn preview:test`.

### Running all tests in headless mode

You will need to have the `.env.test` file from the other section.

You can simply run: `yarn test`. This will:

1. Build your app in test mode (using the `.env.test` file to pull env variables)
2. Start your app in preview mode (simply serve the generated files with a static http server, but using the same `.env.test` file)
3. Start the cypress tests to run your full test suite (this can take a while depending on the number of tests you have)
