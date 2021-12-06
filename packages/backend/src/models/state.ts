type State = {
  state_id: string;
	pivot_id: string;
	connection: boolean;
  power: boolean | undefined;
  water: boolean | undefined;
  direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | undefined;
	timestamp: Date;
};

export default State;