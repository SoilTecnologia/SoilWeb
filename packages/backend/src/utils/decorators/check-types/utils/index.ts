import { TypeParamError } from '@root/protocols/errors';
import { dateJs } from '@root/utils/handleDates/dateFactory';

const logTypeErrorDecorator = (
  fn: string,
  key: string,
  value: any,
  type?: string
) => {
  console.log(`${dateJs()},Error in ${fn}`);
  console.log(`Type data is not valid in Key: ${key}, Value: ${value}`);
  console.log(
    `Expected type ${type ? type : 'string'}, received type ${typeof value}`
  );
  console.log('....');
};

const logParamsInvalidError = (fn: string, key: string, value: any) => {
  console.log(`${dateJs()},Error in ${fn}`);
  console.log(`Value is not defined: Key: ${key}, Value: ${value}`);
  console.log('....');
};

export { logTypeErrorDecorator, logParamsInvalidError };
