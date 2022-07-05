import dayjs from 'dayjs';

export const dateToFormat = (date: Date) => {
  const formatted = dayjs(date)
    .subtract(3, 'hour')
    .format('DD/MM/YYYY-HH:mm:ss');
  return formatted.replace('-', ' ');
};
