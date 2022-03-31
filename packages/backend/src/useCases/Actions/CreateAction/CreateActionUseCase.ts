/* eslint-disable no-unneeded-ternary */
import { inject, injectable } from 'tsyringe';
import { CreateAction } from '../../../database/model/types/action';
import { IActionRepository } from '../../../database/repositories/Action/IActionRepository';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import emitter from '../../../utils/eventBus';

@injectable()
class CreateActionUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository,
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('NodesRepository') private nodeRepository: INodesRepository,
    @inject('FarmsRepository') private farmsRepository: IFarmsRepository
  ) {}

  async execute(
    action: Omit<CreateAction, 'timestamp_sent'>,
    timestamp: CreateAction['timestamp_sent'] | null
  ) {
    console.log(`Action:   ${action}`);
    const newTimestamp = timestamp ? timestamp : new Date();
    const actionResult = await this.actionRepository.create({
      ...action,
      timestamp_sent: newTimestamp
    });

    const pivot = await this.pivotRepository.findById(action.pivot_id);

    const node = await this.nodeRepository.findById(pivot?.node_id);

    const farm = await this.farmsRepository.findById(pivot!!.farm_id);
    const { node_num, is_gprs } = node!!;

    emitter.emit('action', {
      farm_id: farm!!.farm_id,
      is_gprs,
      node_num,
      user_id: farm?.user_id,
      payload: {
        action_id: actionResult[0].action_id!!,
        pivot_id: pivot?.pivot_id,
        radio_id: pivot?.radio_id,
        author: action.author,
        power: action.power,
        water: action.water,
        direction: action.direction,
        percentimeter: action.percentimeter,
        timestamp: newTimestamp
      }
    });

    return action;
  }
}

export { CreateActionUseCase };
