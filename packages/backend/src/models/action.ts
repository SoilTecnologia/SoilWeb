type Action = {
	action_id: string;
	power: boolean;
	water: boolean;
	direction: "CLOCKWISE" | "ANTI_CLOCKWISE";
	percentimeter: number;
	success: boolean | undefined;
	timestamp_sent: Date;
	timestamp_success: Date;
	author: string;
	pivot_id: string;
}