// creates a reducer provided inital state and action handlers by actionType
// const selectReducer = CreateReducerFromHandlers({}, {'ACTIONTYPE' : someHandler});
export function createReducerFromHandlers(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

// creates a reducer that filters its actions before execution
export function createReducerFiltered(reducerFunction, reducerPredicate) {
    return (state, action) => {
        const isInitializationCall = state === undefined;
        const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
        return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
    }
}

// provide a name and reducer will check for it in action.meta before execution
export function createReducerNamespace(reducerFunc, namespace){
    return createReducerFiltered(reducerFunc, function predicate(action){

      if(!action.namespace) return false // early bail
      
      if(action.namespace !== namespace) return false
      if(action.namespace === namespace) return true
    })
}

