type RadioVariable = {
	radio_variable_id: string;
	pivot_id: string;
	father: string | null;
	rssi: number | null;
	timestamp: Date;
}

export default RadioVariable;