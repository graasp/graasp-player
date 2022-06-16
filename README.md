# Graasp Player

## Installation

1. Run `yarn` to install the dependencies
2. Run the API at `localhost:3000`
3. Set the following environnement variables in `.env.local`

```
REACT_APP_API_HOST=http://localhost:3000
PORT=3112
REACT_APP_SHOW_NOTIFICATIONS=true
REACT_APP_AUTHENTICATION_HOST=http://localhost:3001
REACT_APP_H5P_ASSETS_HOST=https://graasp-h5p.s3.eu-central-1.amazonaws.com
REACT_APP_H5P_CONTENT_HOST=http://localhost:3000/p
```

4. Run `yarn start`. The client should be accessible at `localhost:3112`

## Testing

Set the following environnement variables in `.env.test`

```
REACT_APP_API_HOST=http://localhost:3000
PORT=3112
REACT_APP_SHOW_NOTIFICATIONS=false
REACT_APP_NODE_ENV=test
REACT_APP_H5P_ASSETS_HOST=https://graasp-h5p.s3.eu-central-1.amazonaws.com
REACT_APP_H5P_CONTENT_HOST=http://localhost:3000/p
```

Run `yarn cypress`. This should run every tests headlessly.
You can run `yarn cypress:open` to access the framework and visually display the tests' processes.
