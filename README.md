# Graasp Player

[![gitlocalized](https://gitlocalize.com/repo/9233/whole_project/badge.svg)](https://gitlocalize.com/repo/9233?utm_source=badge)

## Running the app

1. Run `yarn` to install the dependencies
2. Run [the API](https://github.com/graasp/graasp) at [`http://localhost:3000`](http://localhost:3000)
3. Set the following environnement variables in `.env.development`

    ```sh
    VITE_PORT=3112
    VITE_GRAASP_API_HOST=http://localhost:3000
    VITE_GRAASP_AUTH_HOST=http://localhost:3001
    VITE_GRAASP_BUILDER_HOST=http://localhost:3111
    VITE_GRAASP_LIBRARY_HOST=http://localhost:3005
    VITE_SENTRY_ENV=development
    VITE_SHOW_NOTIFICATIONS=true
    VITE_H5P_INTEGRATION_URL=
    ```

4. Run `yarn start`. The client should be accessible at [`http://localhost:3112`](http://localhost:3112)

## Testing the app

The tests are run using Cypress. Cypress only compiles the code for the tests, your app needs to run at the specified `baseUrl` (for tests this defaults to http://localhost:3112).

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

:warning: It is possible that the websocket test become flacky (or just stop passing) if you use the dev server. In that case, you can resort to first building the app in test mode `yarn build:test` and then starting a preview of the app with `yarn preview:test`.

### Running all tests in headless mode

You will need to have the `.env.test` file from the other section.

You can simply run: `yarn test`. This will:

1. Build your app in test mode (using the `.env.test` file to pull env variables)
2. Start your app in preview mode (simply serve the generated files with a static http server, but using the same `.env.test` file)
3. Start the cypress tests to run your full test suite (this can take a while depending on the number of tests you have)

## Options

You can disable opening the url on start by adding the following line to your `.env.development`/`.env.test` file:

```sh
BROWSER='none'
```
