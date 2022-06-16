import emitter from '@root/utils/eventBus';
import { handleResultAction } from '@utils/handleFarmIdWithUndescores';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

class IoConnect {
  public static io: Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;
  constructor(
    private io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >
  ) {
    this.io = io;
  }

  start() {
    try {
      this.io.on('connection', (socket: Socket) => {
        emitter.on('action-update', (action) => {
          socket.emit(`action-response-${action.id}`, {
            type: 'sucess'
          });
        });

        emitter.on('action-not-update', (action) => {
          socket.emit(`action-response-${action.id}`, {
            type: 'fail'
          });
        });

        emitter.on('state-change', (status: any) => {
          const {
            user_id,
            pivot_num,
            farm_name,
            pivot_id,
            connection,
            power,
            water,
            direction,
            percentimeter
          } = status;
          socket.emit(`${user_id}-status`, {
            type: 'status',
            pivot_id,
            pivot_num,
            farm_name,
            power,
            water,
            direction,
            connection,
            percentimeter
          });
          emitter.off('connection', () => {});

          // console.log(`socket de state: `, status);
        });

        emitter.on('variable-change', (status: any) => {
          const { user_id, pivot_id, angle, percentimeter } = status;
          socket.emit(`${user_id}-status`, {
            type: 'variable',
            pivot_id,
            angle,
            percentimeter
          });
          emitter.off('variable-change', () => {});

          // console.log(`socket de variavel: `, status);
        });

        emitter.on('action-received-ack', async (action) => {
          const { user_id, farm_name, pivot_num } = await handleResultAction(
            action.id
          );

          socket.emit(`ack-response-${action.id}`, {
            type: 'sucess',
            user_id: user_id,
            pivot_id: action.id,
            pivot_num,
            farm_name
          });

          emitter.off('action-received-ack', () => {});
        });

        emitter.on('action-ack-not-received', async (action) => {
          const { user_id, farm_name, pivot_num } = await handleResultAction(
            action.id
          );

          socket.emit(`ack-response-${action.id}`, {
            user_id,
            type: 'fail',
            pivot_id: action.id,
            pivot_num,
            farm_name
          });

          emitter.off('action-ack-not-received', () => {});
        });
      });
    } catch (err) {
      const error = err as Error;
      console.log('Error to connect Io');
      console.log(error.message);
    }
  }
}

export { IoConnect };
