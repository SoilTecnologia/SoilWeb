import User from './user';

type Action = {
  action_id: string;
  power: boolean;
  water: boolean;
  direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE';
  percentimeter: number;
  success: boolean | null;
  timestamp_sent: Date;
  timestamp_success: Date;
  author: string;
  pivot_id: string;
  user_id: User['user_id'];
  radio_id: number;
};

export default Action;
