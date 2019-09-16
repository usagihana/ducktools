![Ducktools Logo](logo.jpg)
# ducktools - namespaced reducer package (duck) factories
### reduce boilerplate and increase fun with redux

## Why?
Boilerplate makes redux tedious.
Most reducers are either just a value, async value or a list of values.
These reusable, namespaced, state slice reducer packages help you save time

## Usage:
### createValueDuck
```
import { createValueDuck } from "@usagihana/ducktools"


// choose a namespace, onlyActions with correct namespaces will be send to these reducers
const namespace = "myNamespace";

export const myValueDuck = createValueDuck(namespace);

// ducks bundle their namespüaced reducer, action creators and action types
export const reducer = myValueDuck.reducer


// createValueDuck returns
/*  const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(valueReducer, namespace) : valueReducer,
        //types
        VALUE_CREATED, 
        VALUE_REMOVED,
        // action creators
        create, 
        remove,
    }
*/


store.dispatch( myValueDuck.create('value') )
// store.dispatch({type:myValueDuck.VALUE_CREATE, namespace: 'myNamespace', payload:'value' })

store.dispatch( myListDuck.remove() )
```


### createAsyncDuck
```
import { createAsyncDuck } from "@usagihana/ducktools"


const namespace = "myNamespace";

const myAsyncDuck = createAsyncDuck(namespace);

export const reducer = myAsyncDuck.reducer


// createAsyncDuck returns: 
/*
    const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(asyncReducer, namespace) : asyncReducer,
        // types
        ASYNC_REQUESTED, 
        ASYNC_REJECTED,
        ASYNC_FULFILLED,
        // action creators
        request, 
        reject, 
        fulfill,
        // thunks
        asyncFetchData
    }
*/



store.dispatch( myListDuck.request() )

setTimeout( () => {
  const data = 'value'
  store.dispatch( myListDuck.fulfill(data) )
}, 1000)

// store.dispatch( myAsyncDuck.reject() )
// store.dispatch({type:myAsyncDuck.ASYNC_REJECTED, namespace: 'myNamespace'})
```



### createListDuck
```
import { createListDuck } from "@usagihana/ducktools"


const namespace = "myNamespace";

export const myListDuck = createListDuck(namespace);

export const rootReducer = myListDuck.reducer


// createListDuck returns: 
/*  const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(listReducer, namespace) : listReducer,
        // type
        LIST_CREATED, 
        LIST_REMOVED,
        LIST_RESET,
        LIST_CREATEDMANY,
        LIST_SORT,
        // creators
        create, 
        remove,
        reset,
        createMany,
        sort
    }
*/


store.dispatch( myListDuck.create({ id: 'myId',  name: "bla" }) )
store.dispatch( myListDuck.create({ id: 'myId2', name: "bla" }) )
// store.dispatch({type:myListDuck.LIST_CREATE, namespace: 'myNamespace', payload:{ id: 'myId',  name: "bla" }})

// list have a object with IDs as keys and a order array

// state after dispatches
const stateShape = {
    list: { 
        "myID": { id: "myID" },
        "myID2": { id: "myID2" }
    },
    listOrder: [
        "myID", 
        "myID2"
    ]
}

```



### Full Usage Example:
```
import { createValueDuck, createAsyncDuck, createListDuck } from "@usagihana/ducktools"


// choose a namespace, onlyActions with correct namespaces will be send to these reducers
//
const namespace = "myNamespace";

const myListDuck = createListDuck(namespace);
const myValueDuck = createValueDuck(namespace);
const myAsyncDuck = createAsyncDuck(namespace);

const rootReducer = combineReducers({
    myList: myListDuck.reducer,
    myValue: myValueDuck.reducer,
    myAsyncDuck: myAsyncDuck.reducer
})


// create store like normal
//
const store = createStore(rootReducer, undefined, applyMiddleware(logger,thunk))


/* valueDuck 
   actionCreators: { create, remove }
*/

store.dispatch( myValueDuck.create('value') )
// store.dispatch({type:myValueDuck.VALUE_CREATE, namespace: 'myNamespace', payload:'value' })

store.dispatch( myListDuck.remove() )



/* listDuck
   actionCreators: { create, remove, reset, createMany, sort } 
*/

store.dispatch( myListDuck.create({ id: 'myId',  name: "bla" }) )
store.dispatch( myListDuck.create({ id: 'myId2', name: "bla" }) )
// store.dispatch({type:myListDuck.LIST_CREATE, namespace: 'myNamespace', payload:{ id: 'myId',  name: "bla" }})

// list have a object with IDs as keys and a order array


/* asyncDuck
   actionCreators: { request, reject, fulfill }
*/

store.dispatch( myListDuck.request() )

setTimeout( () => {
  const data = 'value'
  store.dispatch( myListDuck.fulfill(data) )
}, 1000)

// store.dispatch( myAsyncDuck.reject() )
// store.dispatch({type:myAsyncDuck.ASYNC_REJECTED, namespace: 'myNamespace'})
```
