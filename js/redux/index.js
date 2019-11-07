const {createStore} = require('redux');

// Reducer
function counter(state = 0, action) {
    switch (action.type) {
        case 'SET_TAB':
            return {...state, tab: action.tab};
        default:
            return state
    }
}
// Initialize store
let store = createStore(counter, {
    tab: null
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// Actions
const SET_TAB = ({tab}) => ({type: 'SET_TAB', tab});

module.exports = {
    SET_TAB,
    store
};
