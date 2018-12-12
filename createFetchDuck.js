import { createReducerNamespace } from './createReducer'

//
// Fetching Indicator Single Value
//

// types
//
export const FETCH_REQUESTED = 'FETCH_REQUESTED';
export const FETCH_FULFILLED = 'FETCH_FULFILLED';
export const FETCH_REJECTED  = 'FETCH_REJECTED';


// state slice / reducer
//
export const stateShape = null // simple reference for state

export function reducer(state = false, action){
    switch(action.type) {
        
        case FETCH_REQUESTED: 
            return true
        case FETCH_FULFILLED: 
            return false
        case FETCH_REJECTED:  
            return stateShape
            
        default:
            return state;
    }
};

// construct a duck package with optional namespace filtering
//
export function createFetchDuck(namespace){
    
    // action creators
    function request(){ 
        return { type: FETCH_REQUESTED, namespace }
    }
    
    function reject(){ 
        return { type: FETCH_REJECTED, namespace }
    }
    
    function fulfill(payload){ 
        return { type: FETCH_FULFILLED, namespace, payload }
    }
    
    // async Creators (thunk)
    function asyncFetchData(url){
         return function thunk(dispatch, getState){
             dispatch(request())
             
             fetch(url)
                .then( res => res.json() )
                .catch( err => {
                    dispatch(reject())
                    console.warn(err) 
                })
         }
    }
    
    const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(reducer, namespace) : reducer,
        // types
        FETCH_REQUESTED, 
        FETCH_FULFILLED, 
        FETCH_REJECTED,
        // actions
        request, 
        reject, 
        fulfill,
        // thunks
        asyncFetchData
        //epics
    }
    
    return duck
}
