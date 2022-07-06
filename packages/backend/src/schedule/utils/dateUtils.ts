import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import schedule from 'node-schedule';
import { RecurrenceRule } from 'node-schedule';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { dateJs } from '../../utils/handleDates/dateFactory';
import { dateSaoPaulo, dateString } from '../../utils/convertTimeZoneDate';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

const dateRuleSchedule = (date: Date): RecurrenceRule => {
  const dateLocal = dayjs(date).tz('America/Sao_Paulo');

  const rule = new schedule.RecurrenceRule();
  rule.date = dateLocal.date();
  rule.month = dateLocal.month();
  rule.year = dateLocal.year();
  rule.hour = dateLocal.add(3, 'hour').hour();
  rule.minute = dateLocal.minute();
  rule.second = dateLocal.second();
  rule.tz = 'America/Sao_Paulo'.trim();

  return rule;
};

const checkDateGranted = (date: Date, agendamento?: string) => {
  const dateNow = dayjs().subtract(3, 'hour');
  const dateReceived = dayjs(date).add(1, 'month').subtract(1, 'day');
  const dateIsBefore = dateReceived.isSameOrBefore(dateNow);
  console.log(
    `Agendamento: ${agendamento}: \nHora Atual -> ${dateNow}, Hora Recebida: ${dateReceived}\n`
  );
  return dateIsBefore;
};

export { dateRuleSchedule, checkDateGranted };
