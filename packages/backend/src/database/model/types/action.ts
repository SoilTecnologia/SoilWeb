import { ActionModel } from '../Action';

export type CreateAction = Omit<
  ActionModel,
  'action_id' | 'success' | 'timestamp_success' | 'user_id' | 'radio_id'
>;
