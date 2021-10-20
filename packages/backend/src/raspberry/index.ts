import { watchFile, write, open } from 'fs';

export const start = () => {
  watchFile('./message.txt', (curr, prev) => {
    console.log('Changed!');
  });
};

import { Buffer } from 'buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js\n'));
open('./message.txt', 'a', (err, fd) => {
  setInterval(() => {
    write(fd, data, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  }, 5000);
});
