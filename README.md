![Ducktools Logo](logo.jpg)
# ducktools
## namespaced duck (reducer package) factories for redux to reduce boilerplate and increase fun

alpha version

todo: add tests
todo: add better docs and examples

## usage
```
import { createListDuck, LIST_CREATE } from 'ducktools'

const namespace = 'myList'

const myListDuck = createListDuck(namespace)

exprt const myReducer = myListDuck.reducer

// dispatch({type:myListDuck.LIST_CREATE, namespace: 'myList'}, payload)

// dispatch({type: LIST_CREATE, namespace, payload})

// dispatch(myListDuck.create(payload))
```
