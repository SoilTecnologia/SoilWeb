class SchedulingModel {
   scheduling_id: string; 

   pivot_id: string;

   power: boolean | null;

   water: boolean | null;

   direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | null;

   start_angle: number | null;

   end_angle: number | null;

   percentimeter: number | null;

   timestamp_start: Date | null;

   timestamp_end: Date | null;

}

export {SchedulingModel}