const redux=require('redux')

const counterReducer=(state={counter:0}, action)=>{
    if(action.type==="increment")
    {
        return {counter:state.counter+1}
    }
    else{
        return {counter:state.counter-1}
    }
}

const store=redux.createStore(counterReducer)

const counterSubscriber=()=>{
    const latestState=store.getState()

    console.log(latestState)
}

store.Subscribe(counterSubscriber)

store.dispatch({type:'increment'})