const { createActions, createReducer } = require('../dist/state.cjs.js')

describe('state utils', () => {
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

  const reducer = createReducer(
    initialState,
    {
      users: {
        fetchSucceeded: (state, action) => ({
          ...state,
          users: action.payload,
          total: action.meta,
        }),
        fetchFailed: (state, action) => ({ ...state, error: action.payload }),
      },
      clear: (state) => ({ ...state, error: null }),
      reset: () => initialState,
    },
    { ...types, reset: resetType }
  )

  describe('createActions', () => {
    test('creates types', () => {
      expect(types.users.fetch).toBe('USERS_FETCH')
      expect(types.users.fetchSucceeded).toBe('USERS_FETCH_SUCCEEDED')
      expect(types.users.fetchFailed).toBe('USERS_FETCH_FAILED')
      expect(types.user.update).toBe('USER_UPDATE')
      expect(types.clear).toBe('CLEAR')
    })

    test('creates action creators', () => {
      expect(actions.users.fetch('test')).toEqual({
        type: 'USERS_FETCH',
        payload: 'test',
      })
      expect(actions.users.fetchSucceeded('test', 'test_meta')).toEqual({
        type: 'USERS_FETCH_SUCCEEDED',
        payload: 'test',
        meta: 'test_meta',
      })
      expect(actions.users.fetchFailed('test')).toEqual({
        type: 'USERS_FETCH_FAILED',
        payload: 'test',
        error: true,
      })
      expect(actions.user.update('test')).toEqual({
        type: 'USER_UPDATE',
        payload: 'test',
      })
      expect(actions.clear()).toEqual({ type: 'CLEAR' })
    })

    test('requires config', () => {
      expect(() => createActions()).toThrow()
    })
  })

  describe('createReducer', () => {
    test('uses initial state', () => {
      expect(reducer(undefined, {})).toBe(initialState)
    })

    test('triggers reducers', () => {
      expect(
        reducer(undefined, {
          type: 'USERS_FETCH_SUCCEEDED',
          payload: [{ id: 1 }],
          meta: 1,
        })
      ).toEqual({
        users: [{ id: 1 }],
        total: 1,
        error: null,
      })

      expect(
        reducer(undefined, {
          type: 'USERS_FETCH_FAILED',
          payload: 'test',
          error: true,
        })
      ).toEqual({
        users: [],
        total: 0,
        error: 'test',
      })

      expect(
        reducer(
          {
            users: [{ id: 1 }],
            total: 1,
            error: 'test',
          },
          { type: 'CLEAR' }
        )
      ).toEqual({
        users: [{ id: 1 }],
        total: 1,
        error: null,
      })

      expect(
        reducer(
          {
            users: [{ id: 1 }],
            total: 1,
            error: 'test',
          },
          { type: resetType }
        )
      ).toEqual(initialState)
    })
  })
})
