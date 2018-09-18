const isObject = obj => obj && typeof obj === 'object'
const toType = str =>
  str
    .split(/(?=[A-Z])/)
    .map(s => s.toUpperCase())
    .join('_')

export const createActions = (config, ns) => {
  if (!isObject(config)) {
    throw Error('createActions requires an object as a first argument')
  }

  let types = {}
  let actions = {}

  Object.keys(config).map(key => [key, config[key]]).forEach(([key, value]) => {
    if (isObject(value) && !Array.isArray(value)) {
      const result = createActions(value, key)
      types = {
        ...types,
        ...result.types,
      }
      actions = {
        ...actions,
        ...result.actions,
      }
    } else {
      const type = ns ? `${ns.toUpperCase()}_${toType(key)}` : toType(key)
      const action = (...args) => {
        let result = { type }
        if (value === null) {
          return result
        }

        const params = Array.isArray(value) ? value : [value]
        params.forEach((param, index) => {
          if (typeof param === 'string') {
            result[param] = args[index]
          } else if (isObject(param)) {
            result = {
              ...result,
              ...param,
            }
          }
        })

        return result
      }

      types[key] = type
      actions[key] = action
    }
  })

  return {
    types: ns ? { [ns]: types } : types,
    actions: ns ? { [ns]: actions } : actions,
  }
}

const actionsMap = (config, types) => {
  let map = {}

  Object.keys(config).map(key => [key, config[key]]).forEach(([key, value]) => {
    if (isObject(value)) {
      map = {
        ...map,
        ...actionsMap(value, types[key]),
      }
    } else if (typeof value === 'function' && typeof types[key] === 'string') {
      map[types[key]] = value
    }
  })

  return map
}

export const createReducer = (initialState, config, types) => {
  const map = actionsMap(config, types)

  return (state = initialState, action) => {
    const reducer = map[action.type]

    if (reducer) {
      return reducer(state, action)
    }

    return state
  }
}
