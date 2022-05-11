import emitter from '../../../../utils/eventBus';

interface responseActive {
  id: string;
}

class EmitterResponse {
  public responseAction: responseActive[];

  constructor() {
    this.responseAction = [{} as responseActive];
  }

  public async start(pivot_id: string) {
    const pivotExist = this.responseAction.some((item) => item.id === pivot_id);

    if (pivotExist) {
      console.log(`Resposta recebida no pivo ${pivot_id}`);
      emitter.emit('action-received-ack', {
        id: pivot_id
      });
    } else {
      console.log(`Resposta não recebida no pivo ${pivot_id}`);
      emitter.emit('action-ack-not-received', {
        id: pivot_id
      });
    }
    console.log('....');
    this.responseAction = this.responseAction.filter(
      (item) => item.id !== pivot_id
    );
  }
}

const emitterResponse = new EmitterResponse();
export { emitterResponse };
