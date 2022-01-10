type Action = {
	action_id: string;
	power: boolean;
	water: boolean;
	direction: "CLOCKWISE" | "ANTI_CLOCKWISE";
	percentimeter: number;
	success: boolean | null;
	timestamp_sent: Date;
	timestamp_success: Date;
	author: string;
	pivot_id: string;
	radio_id: number;
}

export default Action;