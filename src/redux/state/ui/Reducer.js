import { TOGGLE_AUTH_MODAL } from "./ActionType"

const initalState={
    isAuthModalOpen:false
}

const uiReducer=(state=initalState,action)=>{
    switch(action.type){
        case TOGGLE_AUTH_MODAL:
            return {...state,isAuthModalOpen:action.payload};
        default:
            return state;
    }
};

export default uiReducer;