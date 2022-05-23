// Set the date to "2018-09-01T16:01:36.386Z"
import { utcToZonedTime } from 'date-fns-tz';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

export const convertData = (date: Date) => {
  const timeZone = 'America/Sao_Paulo'; // Vamos ver que horas são Lá Embaixo
  const timeInBrisbane = utcToZonedTime(date, timeZone);

  console.log(timeInBrisbane);

  return timeInBrisbane;
};

const createDate = (date?: Date) => {
  if (date) {
    const newDate = date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
    return newDate;
  } else {
    return new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
  }
};

const dateSaoPaulo = (date: Date) => {
  const dateResponse = dayjs(date).tz('America/Sao_Paulo').subtract(3, 'hour');
  return dateResponse.toDate();
};

const dateIsAter = (dateOne: Date, dateTwo: Date) => {
  const dateNow = dayjs(dateOne).tz('America/Sao_Paulo');
  const dateReceived = dayjs(dateTwo)
    .tz('America/Sao_Paulo')
    .subtract(3, 'hour');
  const dateIsBefore = dayjs(dateReceived).isSameOrAfter(dateNow);
  console.log(`Data inicio: ${dateNow}`);
  console.log(`Data final: ${dateReceived}`);
  return dateIsBefore;
};
// export const dateLocal = (date: Date) => dayjs(date).toDate();
const dateLocal = (date: Date) => dayjs(date).subtract(3, 'hour').toDate();

export { dateIsAter, dateLocal, dateSaoPaulo, createDate };
