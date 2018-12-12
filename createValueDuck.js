import { createReducerNamespace } from './createReducer'

//
// manages a single reference/value
// useful for select boxes etc.
// uses: metadataValue, isFetchingValue
//


// types
//
export const VALUE_CREATED = 'VALUE_CREATED';
export const VALUE_REMOVED = 'VALUE_REMOVED';


// state slice reducer
//
export const stateShape = null // simple reference for state

export function reducer(state = stateShape, action){
    switch(action.type) {
        
        case VALUE_CREATED: // since we only have one value its easy
            return action.payload // return a new reference
            
        case VALUE_REMOVED:
            return stateShape
            
        default:
            return state;
    }
    
};


// construct a duck package with optional namespace filtering
//
export function createValueDuck(namespace){
    
    // action creators
    function create(value){ return {type: VALUE_CREATED, payload: value, namespace} }
    
    function resetED_VALUE(){ return {type: RESETED_VALUE, namespace} }
    
    function remove(){ return {type: VALUE_REMOVED, namespace} }


    const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(reducer, namespace) : reducer,
        // types
        VALUE_CREATED, 
        VALUE_REMOVED,
        // actions
        create, 
        remove,
        // thunks, epics, sagas, data
    }
    
    return duck
}

