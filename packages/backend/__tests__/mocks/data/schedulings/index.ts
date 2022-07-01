import { SchedulingModel } from '@root/database/model/Scheduling';
import { uuidGlobal } from '../global';
import { addPivot } from '../pivots';
import { addUser, userCreated } from '../users/user-values-for-mocks';

export const addScheduling: Omit<SchedulingModel, 'scheduling_id' | 'author'> =
  {
    pivot_id: addPivot.pivot_id,
    is_stop: false,
    power: true,
    water: false,
    direction: 'CLOCKWISE',
    percentimeter: 55,
    start_timestamp: new Date(),
    end_timestamp: new Date(),
    timestamp: new Date()
  };

export const newScheduling = {
  ...addScheduling,
  author: userCreated.user_id,
  scheduling_id: uuidGlobal
};
