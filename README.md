# redux-tcr

Declarative Redux action creators and reducers.

## Installation

```bash
yarn add redux-tcr
```

## Usage


```js
import { createActions, createReducer } from 'redux-tcr'

const payload = 'payload'
const resetType = 'RESET'

const initialState = {
  users: [],
  total: 0,
  error: null,
}

const { types, actions } = createActions({
  users: {
    fetch: payload,
    fetchSucceeded: [payload, 'meta'],
    fetchFailed: [payload, { error: true }],
  },
  user: {
    update: payload,
  },
  clear: null,
})

const reducer = createReducer(initialState, {
  users: {
    fetchSucceeded: (state, action) => ({
      ...state,
      users: action.payload,
      total: action.meta,
    }),
    fetchFailed: (state, action) => ({ ...state, error: action.payload }),
  },
  clear: state => ({ ...state, error: null }),
  reset: () => initialState,
  }, {
    ...types,
    reset: resetType
  }
)

console.log(types.users.fetch) // => USERS_FETCH
console.log(types.users.fetchSucceeded) // => USERS_FETCH_SUCCEEDED
console.log(types.user.update) // => USER_UPDATE
console.log(types.clear) // => CLEAR

console.log(actions.users.fetch(1)) // => {type: "USERS_FETCH", payload: 1}
console.log(actions.users.fetchFailed('Error')) // => {type: "USERS_FETCH_FAILED", payload: "Error", error: true}
console.log(actions.clear()) // => {type: "CLEAR", payload: "Error", error: true}

console.log(reducer(undefined, actions.users.fetchSucceeded([{id: 1}], 1))) // => {users: [{id: 1}], total: 1, error: null}
console.log(reducer({users: [], total: 0, error: 'Error'}, actions.clear())) // => {users: [], total: 0, error: null}

```

## Development

Clone this repository and install its dependencies:

```bash
git clone https://github.com/k48/redux-tcr
cd redux-tcr
yarn install
```

`npm run build` builds the library to `dist`, generating three files:

* `dist/state.cjs.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
* `dist/state.esm.js`
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json
* `dist/state.umd.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. This corresponds to the `"browser"` field in package.json

`npm run dev` builds the library, then keeps rebuilding it whenever the source files change using [rollup-watch](https://github.com/rollup/rollup-watch).

`npm test` runs tests.

## License

[MIT](LICENSE).
