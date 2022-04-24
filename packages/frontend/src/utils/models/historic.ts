import State from "./state";

interface Historic {
  states: State[];
  percentimeters: PercentimetersInterface[];
  start_date: Date;
  is_running: boolean;
  start_state: State;
  end_date: Date;
}

export interface PercentimetersInterface {
  value: number;
  timestamp: string;
}

export default Historic
