import { watchFile, write, open } from 'fs';

export const start = () => {
  watchFile('./message.txt', (curr, prev) => {
    console.log('Changed!');
  });
};
