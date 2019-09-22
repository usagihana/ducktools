
// awesome testing
import { test } from "tape"

// you know all this is standard redux api stuff
import { createStore, applyMiddleware, logger, thunk, combineReducers } from "./mockdux"

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

const mockItem1 = { id: 'myId', name: "bla"}
const mockItem2 = { id: 'myId2', name: "bla", extra: 'extra'}


test('createListDuck', function (t) {
    let state = store.getState().myList
    t.ok(state.list, 'init state is defined')
    t.ok(myListDuck.namespace === namespace, 'namespace is correct');
    t.end();
});


test('create Items', function (t) {

    store.dispatch(myListDuck.create(mockItem1))

    let state = store.getState().myList

    t.ok(state.list['myId'] && state.list['myId'].id === 'myId', 'item is present in list and value is correct')
    t.ok(state.listOrder.length === 1 && state.listOrder[0] === 'myId', 'array is present and item is in position 0')

    const myArrRef = state.listOrder
    const mockItem3 = { id: 'myId3', name: "bla", extra: 'extra' }

    store.dispatch(myListDuck.create(mockItem2))
    store.dispatch(myListDuck.create(mockItem3))

    state = store.getState().myList

    t.ok(myArrRef !== state.listOrder, 'should not have the same ref after dispatching')

    const mockItem2Overwriite = { id: 'myId2', name: "blabla" }
    const myArrRef2 = state.listOrde

    store.dispatch(myListDuck.create(mockItem2Overwriite))

    state = store.getState().myList

    t.ok(myArrRef2 !== state.listOrder && state.listOrder.length === 3 && state.list['myId2'].name === "blabla", 'overwriting should not add to array, changes references and content')

    t.end();
});



test('delete Items', function (t) {

    store.dispatch(myListDuck.remove("myId"))

    let state = store.getState().myList

    t.ok(state.listOrder.length === 2 && !state.list["myId"], 'length should be shorter now myId removed')

    t.end();
});


test('overwrite and merge Items', function (t) {

    store.dispatch(myListDuck.create({ id: 'myId2', name: "bla" }))

    let state = store.getState().myList

    t.ok(!state.list["myId2"].extra, 'extra should be gone since we replaced the item')

    store.dispatch(myListDuck.merge({ id: 'myId3', name: "bla" }))

    state = store.getState().myList

    t.ok(state.list["myId3"].extra, 'extra should be there since we merged the item')

    t.end();
});

