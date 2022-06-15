
interface IEncrypter {
  encrypt(value: string): Promise<string | Error>;
}
  
export { IEncrypter };
