import { logger } from '../utils/tracer-logger.js';
import type { Action, Dispatch, Store } from '../reducers/types';
import {
  CALCULATE_BOUNDING_BOX,
  CALCULATE_OVERVIEW_BOUNDING_BOXES,
  PERFORM_SCROLL,
  REFRESH_BOUNDING_BOXES,
  SET_BOUNDING_BOX,
  SET_BOUNDING_BOX_GROUP
} from '../constants/actionTypes';

const blackList = [
  CALCULATE_OVERVIEW_BOUNDING_BOXES,
  CALCULATE_BOUNDING_BOX,
  SET_BOUNDING_BOX,
  SET_BOUNDING_BOX_GROUP,
  REFRESH_BOUNDING_BOXES,
  PERFORM_SCROLL
];
const payloadLengthLimit = 200;

export default (_: Store) => (next: Dispatch) => (action: Action) => {
  if (action.constructor && action.constructor.name === 'AsyncFunction') {
    const actionAsAsyncFunction = action as unknown as Function;
    // eslint-disable-next-line no-console
    logger.debug(
      `[Async Function] ${
        actionAsAsyncFunction.name ||
        (actionAsAsyncFunction.prototype &&
          actionAsAsyncFunction.prototype.name) ||
        '<anonynumous>'
      }`
    );
  } else if (!blackList.includes(action.type)) {
    let { payload, type, ...action_less } = action;

    logger.debug('ACTION %s', type);

    let format_string;
    if (payload && JSON.stringify(payload).length > payloadLengthLimit) {
      payload = `${JSON.stringify(action.payload).substr(
        0,
        payloadLengthLimit
      )}...`;
      format_string = 'payload(short):%j other:%j';
    } else {
      format_string = 'payload:%j other:%j';
    }
    logger.log(format_string, payload, action_less);
  }

  return next(action);
};
