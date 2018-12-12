![Ducktools Logo](logo.jpg)
# ducktools
namespaced duck (reducer package) factories for redux to reduce boilerplate and increase fun

## usage
```
import { createListDuck, CREATE } from 'ducktools'

const namespace = 'myList'

const myListDuck = createListDuck(namespace)

exprt const myReducer = myListDuck.reducer

// dispatch({type:myListDuck.CREATE, namespace: 'myList'})

// dispatch({type: CREATE, namespace})

// dispatch(myListDuck.create())
```
