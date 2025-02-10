/* eslint-disable prettier/prettier */
export const saveStateToLocalStorage = (key, state):void => {
    localStorage.setItem(key, JSON.stringify(state))
}
// const loadStateFromLocalStorage = (key):string => {
//     const state = localStorage.getItem(key);
//     return state ? JSON.parse(state) : null;
// };