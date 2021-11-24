type State = {
  state_id: string;
	pivot_id: string;
	connection: 'ONLINE' | 'OFFLINE';
  power: 'ON' | 'OFF' | 'NULL';
  water: 'DRY' | 'WET' | 'NULL';
  direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | 'NULL';
	timestamp: Date;
};

export default State;