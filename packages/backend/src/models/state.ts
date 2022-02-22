type State = {
  state_id: string;
	pivot_id: string;
	connection: boolean;
  power: boolean | null;
  water: boolean | null;
  direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | null;
	timestamp: Date;
};

export default State;