import { TOGGLE_AUTH_MODAL } from "./ActionType"

export const toggleAuthModal=(isOpen)=>({
    type:TOGGLE_AUTH_MODAL,
    payload:isOpen
});