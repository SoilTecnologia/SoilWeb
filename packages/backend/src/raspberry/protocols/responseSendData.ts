import { StatusObject } from '../../utils/conversions';
import { RadioResponse } from './radioResponse';

interface ResponseSendData  {
  result: StatusObject | undefined;
  data: RadioResponse;
};

export {ResponseSendData}