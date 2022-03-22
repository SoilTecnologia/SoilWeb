type State = {
  state_id: string;
  pivot_id: string;
  connection: boolean;
  power: boolean | null;
  water: boolean | null;
  direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | null;
  timestamp: Date;
};

export type HandleState = Omit<State, 'state_id' | 'pivot_id' | 'timestamp'>;
export interface PayloadState extends HandleState {
  timestamp: Date;
  pivot_id: string;
  angle: number | null;
  percentimeter: number | null;
  father: string | null;
  rssi: number | null;
}

export default State;
