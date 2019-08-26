![Ducktools Logo](logo.jpg)
# ducktools - namespaced duck factories
## to reduce boilerplate and increase fun witjh redux


## Usage:
```
// get a duck factory
import { createListDuck } from "./createListDuck"


/*
    const duck = {
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


const namespace = "myNamespace";
const myListDuck = createListDuck(namespace);

const rootReducer = combineReducers({
    myList: myListDuck.reducer
})

const store = createStore(rootReducer, undefined, applyMiddleware(logger,thunk))

store.dispatch({type: Date.now() }) // init default state

const mockItem1 = { id: 'myId', name: "bla" }
const mockItem2 = { id: 'myId2', name: "bla" }

store.dispatch(myListDuck.create(mockItem1))
store.dispatch(myListDuck.create(mockItem2))

// same as: dispatch({type:myListDuck.LIST_CREATE, namespace: 'myNamespace', payload})
```
