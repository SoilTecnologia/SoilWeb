class PumpModel {
  pump_id: string;

  author: string;

  pivot_id: string;

  pump_power: boolean | null;

  start_pump_angle: number | null;

  end_pump_angle: number | null;

  timestamp: Date | null;
}

export { PumpModel };
