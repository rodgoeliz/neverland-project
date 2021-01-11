import actionTypes from 'constants/newActionTypes';

export const initialState = {
    messages: []
};

const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ui.SHOW_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case actionTypes.ui.REMOVE_FIRST_MESSAGE:
            return {
                ...state,
                messages: state.messages.slice(1),
            };
        case actionTypes.ui.REMOVE_MESSAGE:
            return {
                ...state,
                messages: state.messages.filter(message => message.text !== action.payload.text),
            };
        default:
            return state;
    }
};

export default uiReducer;
