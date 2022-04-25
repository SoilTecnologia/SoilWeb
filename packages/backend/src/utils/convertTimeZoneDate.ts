// Set the date to "2018-09-01T16:01:36.386Z"
import { utcToZonedTime } from 'date-fns-tz';

export const convertData = (date: Date) => {
  const timeZone = 'America/Sao_Paulo'; // Vamos ver que horas são Lá Embaixo
  const timeInBrisbane = utcToZonedTime(date, timeZone);

  console.log(timeInBrisbane);

  return timeInBrisbane;
};

export const createDate = (date?: Date) => {
  if (date) {
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  } else {
    return new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
  }
};
