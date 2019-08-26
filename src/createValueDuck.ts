import { createReducerNamespace } from './createReducer'

//
// manages a single reference/value
// useful for select boxes etc.
// uses: metadataValue
//


// construct a duck package with optional namespace filtering
//
export function createValueDuck(namespace){

    // types
    //
    const VALUE_CREATED = 'VALUE_CREATED';
    const VALUE_REMOVED = 'VALUE_REMOVED';


    // state slice reducer
    //
    function valueReducer(state = null, action){
        switch(action.type) {
            
            case VALUE_CREATED: // since we only have one value its easy
                return action.payload // return a new reference
                
            case VALUE_REMOVED:
                return null
                
            default:
                return state;
        }
        
    };
    
    // action creators
    //
    function create(value){ 
        return {type: VALUE_CREATED, payload: value, namespace} 
    }

    function remove(){ 
        return {type: VALUE_REMOVED, namespace} 
    }


    const duck = {
        namespace,
        reducer: namespace ? createReducerNamespace(valueReducer, namespace) : valueReducer,
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

