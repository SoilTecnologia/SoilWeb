// Set the date to "2018-09-01T16:01:36.386Z"
import { format, utcToZonedTime } from 'date-fns-tz';

export const convertData = (date: Date) => {
  const timeZone = 'America/Sao_Paulo'; // Vamos ver que horas são Lá Embaixo
  const timeInBrisbane = utcToZonedTime(date, timeZone);

  console.log(`
  RealTime: ${format(date, 'yyyy-MM-dd HH:mm:ss')}
  Time in SaoPaulo: ${format(timeInBrisbane, 'yyyy-MM-dd HH:mm:ss')}
`);

  return timeInBrisbane;
};
