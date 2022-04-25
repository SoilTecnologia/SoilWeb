import State from "./state";

interface Historic {
  states: State[];
  percentimeters: PercentimetersInterface[];
  start_date: string;
  is_running: boolean;
  start_state: State;
  end_date: string;
}

export interface PercentimetersInterface {
  value: number;
  timestamp: string;
}

export default Historic;
