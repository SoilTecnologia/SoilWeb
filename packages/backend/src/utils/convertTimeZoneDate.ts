import { dateJs } from './handleDates/dateFactory';


const dateString = (date?: Date) => {
  const hour =  dateJs.tz(date).format('DD/MM/YYYY-HH:mm:ss')
  return hour.replace("-", " ")
}

const dateSaoPaulo = (date: Date) => dateJs.tz(date).subtract(3, "hour").toDate()
const dateAddt3 = (date: Date) => dateJs.tz(date).add(3, "hour").toDate()

const dateIsAter = (dateOne: Date, dateTwo: Date) => {
  const dateNow = dateJs.tz(dateOne);
  const dateReceived = dateSaoPaulo(dateTwo)
  const dateIsBefore = dateJs(dateReceived).isSameOrAfter(dateNow);

  return dateIsBefore;
};

const dateIsBefore = (dateOne: Date, dateTwo: Date) => {
  const dateNow = dateJs(dateOne);
  const dateReceived = dateSaoPaulo(dateTwo);
  const dateIsBefore = dateJs(dateReceived).isSameOrBefore(dateNow);

  return dateIsBefore;
};


export {
  dateIsAter,
  dateIsBefore,
  dateSaoPaulo,
  dateString,
  dateAddt3 };
