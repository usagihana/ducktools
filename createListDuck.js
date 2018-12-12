import { createReducerNamespace } from './createReducer'


// types
//
export const LIST_CREATED = 'LIST_CREATED';
export const LIST_UPDATED = 'LIST_UPDATED';
export const LIST_REMOVED = 'LIST_REMOVED';
export const LIST_RESET = 'LIST_RESET';
export const LIST_SORT = 'LIST_SORT';
export const LIST_CREATEDMANY = 'LIST_CREATEDMANY';


// state slice reducer
//
const stateShape = {
    list:{}, 
    listOrder:[]
}

function reducer(state = stateShape, action) {
    switch (action.type) {
        case LIST_CREATED: {
            const id = action.payload.id
            const inList = state.list[id]
            const newState = {...state}
            
            // overwrite entry with new data
            newState.list[id] = {...action.payload}
            
            // if not yet in list add key to order array
            if(!inList){
                newState.listOrder = newState.listOrder.concat([id])
            }
            
            return newState
        }
        case LIST_REMOVED: {
            const itemId = state.list[action.payload.id]
            if(!itemId) return state
            
            const arrayIndex = state.listOrder.reduce( (x,index) => {
                if(x.id === action.payload.id) return index
            }, null)
            
            delete state.list[action.id]
            arrayRemove(state.listOrder, arrayIndex)
            return state
        }
        case LIST_RESET: {
            Object.keys(state.list).map( x => delete(state.list[x]) )
            state.list = {}
            state.listOrder = []
            state.metadata = null
            return {...stateShape}
        }
        case LIST_CREATEDMANY: {
            const newState = {...state}
            newState.list = Object.assign(newState.list, JSON.parse(JSON.stringify(action.payload.list)) )
            newState.listOrder = newState.listOrder.concat(action.payload.listOrder)
            return newState
        }
        case LIST_SORT: {
            const newState = Object.assign({}, state)
            newState.listOrder.sort(function(a,b){
                return action.payload.sortingFunction(a,b,newState)
            })
            return newState
        }
        default:
            return state;
    }
}


export function createListDuck(namespace){
    
    // action creators
    function create(value){
        return {type: LIST_CREATED, payload: value, namespace}
    }
    
    function update(value){
        return {type: LIST_UPDATED, payload: value, namespace}
    }
    
    function reset(){
        return {type: LIST_RESET, namespace}
    }
    
    function remove(){
        return {type: LIST_REMOVED, namespace}
    }
    
    function createMany({list, listOrder}){
        return {type: LIST_CREATEDMANY, namespace, payload:{ list, listOrder } }
    }
    
    function sort(sortingFunction){
        return {type: LIST_SORT, namespace, payload:{ sortingFunction} }
    }

    const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(reducer, namespace) : reducer,
        // type
        LIST_CREATED, 
        LIST_REMOVED,
        LIST_RESET,
        LIST_CREATEDMANY,
        LIST_SORT,
        // action
        create, 
        //update,
        remove,
        reset,
        createMany,
        sort
        // thunks, 
        // epics, sagas
    }
    
    return duck
}


// Utils
//

export function objectUpdate(oldObject, newValues) {
    // Encapsulate the idea of passing a new object as the first parameter
    // to Object.assign to ensure we correctly copy data instead of mutating
    return Object.assign({}, oldObject, newValues);
}

export function objectRemove(object, key) {
    return delete object[key]
}


export function arrayUpdate(array, uuid, updateItemCallback) {
    const updatedItems = array.map(item => {
        if(item !== uuid) {
            // Since we only want to update one item, preserve all others as they are now
            return item;
        }

        // Use the provided callback to create an updated item
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
}


export function arrayInsert(array, index, item) {
    let newArray = array.slice();
    newArray.splice(index, 0, item);
    return newArray;
}

export function arrayMove(array, from, to) {
  return array.splice(to, 0, array.splice(from, 1)[0]);
};


// immutable
export function arrayRemove(array, index) {
    let newArray = array.slice();
    newArray.splice(index, 1);
    return newArray;
}
