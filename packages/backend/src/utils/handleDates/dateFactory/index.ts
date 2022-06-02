import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from "dayjs/plugin/utc"
import AdvancedFormat from "dayjs/plugin/advancedFormat"

dayjs.extend(AdvancedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.tz.setDefault("America/Sao_Paulo")

const dateJs = dayjs;
export {dateJs}