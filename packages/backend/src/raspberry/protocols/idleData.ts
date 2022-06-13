interface IdleData {
  pivot_id: string;
  radio_id: number;
  attempts: number;
};

interface IdleDataResponseCmd extends IdleData{
  cmdResponse?: string;
}

export {IdleData, IdleDataResponseCmd}