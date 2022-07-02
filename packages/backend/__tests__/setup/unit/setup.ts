import 'reflect-metadata';

const fnDecoratorMocked = (values?: string[]) => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let method = descriptor.value!;
    descriptor.value = function (...args: any[]) {
      return method.apply(this, args);
    };
  };
};

jest.mock('@utils/decorators/check-types', () => {
  return {
    checkDate: fnDecoratorMocked,
    checkBooleans: fnDecoratorMocked,
    checkNumbers: fnDecoratorMocked,
    checkStrings: fnDecoratorMocked,
    checkUndefinedNull: fnDecoratorMocked
  };
});
