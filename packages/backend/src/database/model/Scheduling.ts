class SchedulingModel {
   scheduling_id: string; 

   pivot_id: string;

   power: boolean | null;

   water: boolean | null;

   direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | null;

   start_angle: number | null;

   end_angle: number | null;

   percentimeter: number | null;

   start_timestamp: Date | null;

   end_timestamp: Date | null;

   timestamp: Date | null;

}

export {SchedulingModel}