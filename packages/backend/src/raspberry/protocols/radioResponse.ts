interface RadioResponse {
  cmd: number;
  id: number;
  payload: Array<number>;
  status: string;
  cmdResponse: string;
};

export {RadioResponse}