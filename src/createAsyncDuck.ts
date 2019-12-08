import { createReducerNamespace } from './createReducer'

//
// Fetching Indicator Single Value
//

// construct a duck package with optional namespace filtering
//
export function createAsyncDuck(namespace){

    // types
    //
    const ASYNC_REQUESTED = 'ASYNC_REQUESTED';
    const ASYNC_FULFILLED = 'ASYNC_FULFILLED';
    const ASYNC_REJECTED  = 'ASYNC_REJECTED';


    // state slice / reducer
    //
    const stateShape = null // simple reference for state

    function asyncReducer(state = false, action){
        switch(action.type) {
            
            case ASYNC_REQUESTED: 
                return true
            case ASYNC_FULFILLED: 
                return action.payload
            case ASYNC_REJECTED:  
                return action.payload || null
                
            default:
                return state;
        }
    };
    
    // action creators
    function request(){ 
        return { type: ASYNC_REQUESTED, namespace }
    }
    
    function reject(){ 
        return { type: ASYNC_REJECTED, namespace }
    }
    
    function fulfill(payload){ 
        return { type: ASYNC_FULFILLED, namespace, payload }
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
        reducer: namespace ? createReducerNamespace(asyncReducer, namespace) : asyncReducer,
        // types
        ASYNC_REQUESTED, 
        ASYNC_REJECTED,
        ASYNC_FULFILLED,
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
