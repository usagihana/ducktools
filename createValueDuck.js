import { createReducerNamespace } from './createReducer'

//
// manages a single reference/value
// useful for select boxes etc.
// uses: metadataValue, isFetchingValue
//


// types
//
export const CREATED = 'CREATED';
export const REMOVED = 'REMOVED';
export const RESET = 'RESET';


// state slice reducer
//
export const stateShape = null // simple reference for state

export function reducer(state = stateShape, action){
    switch(action.type) {
        
        case CREATED: // since we only have one value its easy
            return action.payload // return a new reference
            
        case REMOVED:
        case RESET: // and total reset
            return stateShape
            
        default:
            return state;
    }
    
};


// construct a duck package with optional namespace filtering
//
export function createValueDuck(namespace){
    
    // action creators
    function create(value){ return {type: CREATED, payload: value, namespace} }
    
    function reset(){ return {type: RESET, namespace} }
    
    function remove(){ return {type: REMOVED, namespace} }


    const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(reducer, namespace) : reducer,
        // types
        CREATED, 
        REMOVED,
        RESET,
        // actions
        create, 
        remove,
        reset,
        // thunks, epics, sagas, data
    }
    
    return duck
}

