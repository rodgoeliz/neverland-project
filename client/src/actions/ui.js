import actionTypes from 'constants/newActionTypes';

export const hideMessage = (text) => ({
    type: actionTypes.ui.REMOVE_FIRST_MESSAGE,
    payload: { text }
});

export const hideFirstMessage = () => ({ type: actionTypes.ui.REMOVE_FIRST_MESSAGE });

export const showMessage = (message) => (dispatch) => {
    const messageShowTime = 3000;

    dispatch({
        type: actionTypes.ui.SHOW_MESSAGE,
        payload: message,
    });

    setTimeout(() => {
        dispatch(hideFirstMessage());
    }, messageShowTime)
}