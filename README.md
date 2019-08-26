![Ducktools Logo](logo.jpg)
# ducktools - namespaced reducer package (duck) factories
## to reduce boilerplate and increase fun with redux

Why?
Boilerplate makes redux tedious.
Most reducers are either just a value, async value or a list of values.

### createListDuck
#### Map with Values that have an "id", property and a Array with the order of the "id"s

```
// example state
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

// return value of listduckfactory
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
```

### Usage Example:
```
// get a duck factory
import { createListDuck } from "./createListDuck"


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
