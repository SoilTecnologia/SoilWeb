import { StateModel } from '../State';

export type HandleState = Omit<
  StateModel,
  'state_id' | 'pivot_id' | 'timestamp'
>;
export interface PayloadState extends HandleState {
  timestamp: Date;
  pivot_id: string;
  angle: number | null;
  percentimeter: number | null;
  father: string | null;
  rssi: number | null;
}
