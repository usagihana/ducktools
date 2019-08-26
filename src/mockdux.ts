import * as process from 'process'


// Naive Redux
//
export function createStore(rootReducer, initialState, storeEnhancer) {
    const createStore = storeEnhancer 
      ? storeEnhancer(_createStore) 
      : _createStore
      ;
  
    return createStore();
  
    function _createStore() {
      if (!rootReducer) throw Error('rootReducer is missing')
  
      const _mapSubscribers = {}
      const _rootReducer = rootReducer
      const _store = {
          dispatch: baseDispatch,
          getState,
          subscribe
      }
  
      let _state = initialState
  
      return _store;
  
      function getState() {
          return _state
      }
  
      function subscribe(f) {
          _mapSubscribers[uuidv4()] = f
      }
  
      function baseDispatch(action) {
          if (!action || !action.type) throw Error("cant call dispatch without action. stupid.");
  
          _state = _rootReducer(_state, action)
  
          for (var subscriberKey in _mapSubscribers) 
            _mapSubscribers[subscriberKey] ? _mapSubscribers[subscriberKey]() : null;
  
          return true;
      }
    }
}

export function applyMiddleware(...middlewares) {
    return createStore => (...args) => {
        const store = createStore(...args)
        let chain = []
        let dispatch

        const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args)
        }
        chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = compose(...chain)(store.dispatch)

        return {
        ...store,
        dispatch
        }
    }
}

// Middleware
//

export function logger(store){ 
    return next => action => { 
      // console.log( JSON.stringify(action) );
      if(!action.type && action instanceof Function) console.log('thunk: '+action.name)
      var start = process.hrtime();
      // do some processing that takes time
      const result = next( action );
      var end = process.hrtime(start);
      console.log(`${action.type} ${( end )}microsec \n` );
      //console.log(store.getState())
      return result;
    }
};

export const thunk = store => next => action =>
typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action)


/*
function combineReducers(reducerObject:Object):function{}
Combines Reducers by returning a Reducer Reducing Reducers
*/
export function combineReducers(reducerObject){

    function rootReducer(state, action){
        const newState = {}

        Object.keys(reducerObject).reduce( (newState, currentKey) => { 
        if(!state) state = {}
        // if(!state[currentKey]) state[currentKey] = undefined;
        newState[currentKey] = reducerObject[currentKey](state[currentKey], action) 
        return newState

        }, newState)
        
        return newState
    }
    return rootReducer
}

function uuidv4() {
    // RFC4122 version 4 compliant
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0
          , v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg
    }
  
    if (funcs.length === 1) {
      return funcs[0]
    }
  
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}