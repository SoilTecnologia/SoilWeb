import { manageSchedule } from './schedule-action/manage-schedule';
import { manageScheduleAngle } from './schedule-angle/manage-schedule';

class InitScheduleData {
  public static start() {
    manageSchedule.start();
    manageScheduleAngle.start();
  }
}
export { InitScheduleData };
