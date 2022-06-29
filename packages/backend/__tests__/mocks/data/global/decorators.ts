export const mockDecorators = {
  tryQuery() {
    return (
      target: any,
      propertyName: string,
      descriptor: PropertyDescriptor
    ) => {
      let method = descriptor.value!;

      descriptor.value = function (...args: any[]) {
        for (let arg of args) console.log(args);
        return method.apply(this, args);
      };
    };
  }
};
