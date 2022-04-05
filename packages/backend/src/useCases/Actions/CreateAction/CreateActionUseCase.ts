/* eslint-disable no-unneeded-ternary */
import { inject, injectable } from 'tsyringe';
import { CreateAction } from '../../../database/model/types/action';
import { IActionRepository } from '../../../database/repositories/Action/IActionRepository';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class CreateActionUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository,
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  private async applyQueryGetPivotByPivot(pivot_id: string) {
    try {
      return await this.pivotRepository.findById(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateActionUseCase.name,
        'Get Pivot By Pivot Id'
      );
    }
  }

  private async applyQueryCreatedAction(action: CreateAction) {
    try {
      return await this.actionRepository.create(action);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateActionUseCase.name,
        'Create Action'
      );
    }
  }

  private async applyQueryGetNodeByNode(node_id: string) {
    try {
      return await this.nodeRepository.findById(node_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateActionUseCase.name,
        'Get Node By Node Id'
      );
    }
  }

  async execute(
    action: Omit<CreateAction, 'timestamp_sent'>,
    timestamp: CreateAction['timestamp_sent'] | null
  ) {
    const newTimestamp = timestamp ? timestamp : new Date();
    const actionResult = await this.applyQueryCreatedAction({
      ...action,
      timestamp_sent: newTimestamp
    });

    if (!actionResult) throw new Error('Does Not Create Action');

    const pivot = await this.applyQueryGetPivotByPivot(action.pivot_id);
    if (!pivot) throw new Error('Does Not Find Pivot');

    const node = await this.nodeRepository.findById(pivot?.node_id);
    if (!node) throw new Error('Does Not find Node');

    const { farm_id, node_num, is_gprs } = node;

    emitter.emit('action', {
      farm_id,
      is_gprs,
      node_num,
      payload: {
        action_id: actionResult[0].action_id!!,
        pivot_id: pivot.pivot_id,
        radio_id: pivot.radio_id,
        author: action.author,
        power: action.power,
        water: action.water,
        direction: action.direction,
        percentimeter: action.percentimeter,
        timestamp: newTimestamp
      }
    });

    return actionResult ? true : false;
  }
}

export { CreateActionUseCase };
