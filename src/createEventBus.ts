export function createEventBus(debug = false){
  const subscribers = {} // channel => array[callback()]
  
  function on(channel, func){
    let out = func

    if(debug){
      out = function(rest){
        func(rest)
        console.log('   %cEVENT - '+channel,'color:orange;',JSON.stringify(rest))
      }
    }
    
    subscribers[channel] = subscribers[channel] || []
    subscribers[channel].push(out)
    return true
  }
  
  function emit(channel, payload){
    if(!subscribers[channel]) return console.warn('No Subscribers for '+channel)
    subscribers[channel].forEach( f => f(payload) )
  }
  
  function clear(channel){
    subscribers[channel] = null
    subscribers[channel] = []
  }

  const exports = {
    on,
    emit,
    clear
  } 
  
  return exports
}