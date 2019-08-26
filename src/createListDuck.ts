import { createReducerNamespace } from './createReducer'

//
// List Map with Order Array
//

interface IListItem extends Object {
    id: string
  } 

export function createListDuck(namespace){

    // types
    //
    const LIST_CREATED = 'LIST_CREATED';
    const LIST_UPDATED = 'LIST_UPDATED';
    const LIST_REMOVED = 'LIST_REMOVED';
    const LIST_RESET = 'LIST_RESET';
    const LIST_SORT = 'LIST_SORT';
    const LIST_CREATEDMANY = 'LIST_CREATEDMANY';


    // state slice reducer
    //
    const stateShape = {
        list:{}, 
        listOrder:[],
        metadata: null
    }

    function listReducer(state = stateShape, action) {
        switch (action.type) {
            case LIST_CREATED: {
                const id = action.payload.id
                const inList = state.list[id]
                const newState = { list: {...state.list}, listOrder: [...state.listOrder], metadata: {...state.metadata} }
                
                // overwrite entry with new data
                newState.list[id] = {...action.payload}
                
                // if not yet in list add key to order array
                if(!inList){
                    newState.listOrder.push(id)
                }
                
                return newState
            }
            case LIST_REMOVED: {

                if(!state.list[action.payload.id]) return state
                
                const newState = { list: {...state.list}, listOrder: [...state.listOrder], metadata: {...state.metadata} }

                const arrayIndex = newState.listOrder.findIndex( (id, index) => {
                    return id === action.payload.id
                }, null)
                
                delete newState.list[action.payload.id]

                newState.listOrder = arrayRemove(newState.listOrder, arrayIndex)

                return newState
            }
            case LIST_RESET: {
                Object.keys(state.list).map( x => delete(state.list[x]) )
                state.list = {}
                state.listOrder = []
                state.metadata = null
                return {...stateShape}
            }
            case LIST_CREATEDMANY: {
                const newState = { list: {...state.list}, listOrder: [...state.listOrder], metadata: {...state.metadata} }
                newState.list = Object.assign(newState.list, JSON.parse(JSON.stringify(action.payload.list)) )
                newState.listOrder = newState.listOrder.concat(action.payload.listOrder)
                return newState
            }
            case LIST_SORT: {
                const newState = { list: {...state.list}, listOrder: [...state.listOrder], metadata: {...state.metadata} }
                newState.listOrder.sort(function(a,b){
                    return action.payload.sortingFunction(a,b,newState)
                })
                return newState
            }
            default:
                return state;
        }
    }
    
    // action creators
    function create(item:IListItem){
        if(!item.id) throw Error('listItems need an id property')
        return {type: LIST_CREATED, payload: item, namespace}
    }
    
    function reset(){
        return {type: LIST_RESET, namespace}
    }
    
    function remove(id){
        return {type: LIST_REMOVED, namespace, payload: {id:id}}
    }
    
    function createMany({list, listOrder}){
        return {type: LIST_CREATEDMANY, namespace, payload:{ list, listOrder } }
    }
    
    function sort(sortingFunction){
        return {type: LIST_SORT, namespace, payload:{ sortingFunction} }
    }

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

