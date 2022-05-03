import { PumpModel } from "../Pump";

export type PumpAction ={
    pump_id: PumpModel['pump_id'];

    pivot_id: PumpModel['pivot_id'];

    pump_power: 'ON' | 'OFF' | 'NULL';

    startpump_angle: number | 'NULL';

    endpump_angle: number | 'NULL';
};