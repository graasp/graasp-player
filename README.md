# Graasp Player

## Installation

1. Run `yarn` to install the dependencies
2. Run the API at `localhost:3000`
3. Set the following environnement variables in `.env.local`

```sh
VITE_PORT=3112
VITE_GRAASP_API_HOST=http://localhost:3000
VITE_GRAASP_AUTH_HOST=http://localhost:3001
VITE_SENTRY_ENV=development
VITE_H5P_INTEGRATION_URL=
VITE_SHOW_NOTIFICATIONS=true
# only used by the server for tests
VITE_PUBLIC_TAG_ID=123456-123789
VITE_HIDDEN_ITEM_TAG_ID=456789-123456
```

4. Run `yarn start`. The client should be accessible at `localhost:3112`

## Testing

Set the following environnement variables in `.env.test`

```sh
VITE_PORT=3112
VITE_GRAASP_API_HOST=http://localhost:3000
VITE_GRAASP_AUTH_HOST=http://localhost:3001
VITE_SENTRY_ENV=test
VITE_H5P_INTEGRATION_URL=
VITE_SHOW_NOTIFICATIONS=false
VITE_PUBLIC_TAG_ID=123456-123789
VITE_HIDDEN_ITEM_TAG_ID=456789-123456
```

Run `yarn cypress`. This should run every tests headlessly.
You can run `yarn cypress:open` to access the framework and visually display the tests' processes.
