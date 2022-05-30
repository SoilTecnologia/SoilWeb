import { socketsIoConnect } from '../..';

type ackReceived = { pivot_num: number; farm_name: string; user_id: string };

const emitteAckReceived = ({ pivot_num, farm_name, user_id }: ackReceived) => {
  console.log('Enviando socket de atualização');
  socketsIoConnect.socketIo.emit(`${user_id}-ackreceived`, {
    type: 'ack',
    pivot_num,
    farm_name
  });
};

export const socketIo = (type: string, data: any) => {
  switch (type) {
    case 'ackReceived':
      emitteAckReceived(data);
      break;

    default:
      break;
  }
};
