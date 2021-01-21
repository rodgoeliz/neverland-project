import actionTypes from 'constants/newActionTypes';
import { showMessage } from 'actions/ui';
import { UI } from 'constants/ui';

import Api from 'lib/api';

export const updateTracking = ({orderId, trackingNumber, shippingCarrier}) => async(dispatch) => {
  try {
    const response = await Api.post(`/api/order/tracking/update`, {
      orderId,
      trackingNumber,
      trackingCarrier: shippingCarrier
    });
    if (response.data.success) {
      dispatch({
        type: actionTypes.order.UPDATE_TRACKING,
        payload: response.data.payload
      });
    } else {
      dispatch(showMessage({
        type: UI.MESSAGES.ERROR,
        text: response.data.error
      }));
    }
  } catch (error) {
      dispatch(showMessage({
        type: UI.MESSAGES.ERROR,
        text: error.message
      }));
  }
}
