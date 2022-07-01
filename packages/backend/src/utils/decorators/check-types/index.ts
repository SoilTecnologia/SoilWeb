import {
  ParamsInvalid,
  ParamsNotExpected,
  TypeParamError
} from '@root/protocols/errors';
import { dateJs } from '@root/utils/handleDates/dateFactory';
import dayjs from 'dayjs';
import 'reflect-metadata';
import instance from 'tsyringe/dist/typings/dependency-container';
const requiredMetadataKey = Symbol('required');

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
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(`Value is not defined: Key: ${key}, Value: ${value}`);
              throw new ParamsInvalid();
            }
            if (item && typeof value !== 'boolean') {
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(
                `Type data is not valid in Key: ${key}, Value: ${value}`
              );
              console.log(
                `Expected type boolean, received type ${typeof value}`
              );
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
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(`Value is not defined: Key: ${key}, Value: ${value}`);
              throw new ParamsInvalid();
            }
            if (item && typeof value !== 'number') {
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(
                `Type data is not valid in Key: ${key}, Value: ${value}`
              );
              console.log(
                `Expected type numbers, received type ${typeof value}`
              );
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
            if (item && !value) throw new ParamsInvalid();
            if (item && typeof value !== 'string')
              throw new TypeParamError(key);
          } else {
            if (!value) {
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(`Value is not defined: Key: ${key}, Value: ${value}`);
              throw new ParamsInvalid();
            }
            if (typeof value !== 'string') {
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(
                `Type data is not valid in Key: ${key}, Value: ${value}`
              );
              console.log(
                `Expected type string, received type ${typeof value}`
              );
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

            if (item && !value) throw new ParamsInvalid();
            if (item) {
              try {
                const date = dayjs(value as any).isValid();
                if (!date || typeof value !== 'string')
                  throw new TypeParamError(key);
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
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(`Value is not defined: Key: ${key}, Value: ${value}`);
              throw new ParamsInvalid();
            }
          } else {
            if (value === 'undefined' || value === 'null') {
              console.log(`${dateJs()},Error in ${propertyName}`);
              console.log(`Value is not defined: Key: ${key}, Value: ${value}`);
              throw new ParamsInvalid();
            }
          }
        }
      }

      return method.apply(this, args);
    };
  };
}
