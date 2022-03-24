type MessageQueue = {
  type: 'action' | 'status';
  id: string;
  pivot_num?: number | null;
  payload: any;
  attempts?: number;
};

export default MessageQueue