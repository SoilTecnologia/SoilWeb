import {
  ParamsInvalid,
  ParamsNotExpected,
  TypeParamError
} from '@root/protocols/errors';
import dayjs from 'dayjs';
import 'reflect-metadata';
import { logParamsInvalidError, logTypeErrorDecorator } from './utils';

export function checkBooleans(values?: string[]) {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let method = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      for (let arg of args) {
        const array = Object.entries(arg);

        for (let [key, value] of array) {
          if (values && values.length > 0) {
            const item = values.find((item) => item === key);
            if (item && !value && value !== false) {
              logParamsInvalidError(propertyName, key, value);
              throw new ParamsInvalid();
            }
            if (item && typeof value !== 'boolean') {
              logTypeErrorDecorator(propertyName, key, value, 'boolean');
              throw new TypeParamError(key);
            }
          }
        }
      }

      return method.apply(this, args);
    };
  };
}

export function checkNumbers(values?: string[]) {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let method = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      for (let arg of args) {
        const array = Object.entries(arg);

        for (let [key, value] of array) {
          if (values && values.length > 0) {
            const item = values.find((item) => item === key);
            if (item && !value) {
              logParamsInvalidError(propertyName, key, value);
              throw new ParamsInvalid();
            }
            if (item && typeof value !== 'number') {
              logTypeErrorDecorator(propertyName, key, value, 'number');
              throw new TypeParamError(key);
            }
          }
        }
      }

      return method.apply(this, args);
    };
  };
}

export function checkStrings(values?: string[]) {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let method = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      for (let arg of args) {
        const array = Object.entries(arg);

        for (let [key, value] of array) {
          if (values && values.length > 0) {
            const item = values.find((item) => item === key);
            if (item && !value) {
              logParamsInvalidError(propertyName, key, value);
              throw new ParamsInvalid();
            }

            if (item && typeof value !== 'string') {
              logTypeErrorDecorator(propertyName, key, value, 'string');
              throw new TypeParamError(key);
            }
          } else {
            if (!value) {
              logParamsInvalidError(propertyName, key, value);
              throw new ParamsInvalid();
            }
            if (typeof value !== 'string') {
              logTypeErrorDecorator(propertyName, key, value, 'string');
              throw new TypeParamError(key);
            }
          }
        }
      }

      return method.apply(this, args);
    };
  };
}

export function checkDate(values?: string[]) {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let method = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      for (let arg of args) {
        const array = Object.entries(arg);

        for (let [key, value] of array) {
          if (values && values.length > 0) {
            const item = values.find((item) => item === key);

            if (item && !value) {
              logParamsInvalidError(propertyName, key, value);
              throw new ParamsInvalid();
            }
            if (item) {
              try {
                const date = dayjs(value as any).isValid();
                if (!date || typeof value !== 'string') {
                  logTypeErrorDecorator(propertyName, key, value, 'date');
                  throw new TypeParamError(key);
                }
              } catch (err) {
                console.log(
                  `Erro convert value: ${value} of type ${typeof value} in date`
                );
                throw new TypeParamError(key);
              }
            }
          }
        }
      }

      return method.apply(this, args);
    };
  };
}

export function checkUndefinedNull(values?: string[]) {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let method = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      for (let arg of args) {
        const array = Object.entries(arg);

        for (let [key, value] of array) {
          if (values && values.length > 0) {
            const item = values.find((item) => item === key);
            if ((item && value === 'undefined') || value === 'null') {
              logParamsInvalidError(propertyName, key, value);
              throw new ParamsInvalid();
            }
          } else {
            if (value === 'undefined' || value === 'null') {
              logParamsInvalidError(propertyName, key, value);
              throw new ParamsInvalid();
            }
          }
        }
      }

      return method.apply(this, args);
    };
  };
}

export function checkReqData(lenght: number) {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let method = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      const [req, res] = args;

      if (Object.keys(req.body).length > lenght) {
        console.log(`Received Params Not Expected in ${propertyName}`);
        res.status(400).send({ error: new ParamsNotExpected().message });
      } else return method.apply(this, args);
    };
  };
}
