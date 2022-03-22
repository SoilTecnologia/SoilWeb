import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { StateModel } from '../../../database/model/State';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IRadioVariableRepository } from '../../../database/repositories/RadioVariables/IRadioVariableRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariable } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import RadioVariable from '../../../models/radioVariable';
import { HandleState } from '../../../models/state';
import StateVariable from '../../../models/stateVariable';
import emitter from '../../../utils/eventBus';
import {
  isRadioVariableDifferent,
  isStateDifferent,
  isStateVariableDifferent
} from '../../../utils/isDifferent';

@injectable()
class UpdatePivotStateUseCase {
  private shouldNotifyUpdate: boolean;

  private shouldNotifyState: boolean;

  private state: StateModel | undefined;

  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('FarmsRepository') private farmRepository: IFarmsRepository,
    @inject('NodesRepository') private nodesRepository: INodesRepository,
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariable,
    @inject('RadioVariablesRepository')
    private radioVariableRepository: IRadioVariableRepository
  ) {
    this.shouldNotifyUpdate = false;
    this.shouldNotifyState = false;
    this.state = undefined;
  }

  private createStateIfNotExists = async (
    pivot_id: StateModel['pivot_id'],
    oldState: StateModel | undefined,
    newState: HandleState,
    timestamp: Date
  ) => {
    if (!oldState || isStateDifferent(oldState, newState)) {
      this.shouldNotifyUpdate = true;
      this.shouldNotifyState = true;

      this.state = await this.stateRepository.create({
        pivot_id,
        connection: newState.connection,
        power: newState.power,
        water: newState.water,
        direction: newState.direction,
        timestamp: new Date(timestamp)
      });
    }
  };

  private alterStateVariable = async (
    angle: StateVariable['angle'],
    percentimeter: StateVariable['percentimeter'],
    timestamp: StateModel['timestamp']
  ) => {
    if (angle !== undefined && percentimeter !== undefined) {
      if (this.state) {
        const oldStateVariable =
          await this.stateVariableRepository.findByStateId(this.state.state_id);

        if (
          !oldStateVariable ||
          isStateVariableDifferent(oldStateVariable, { angle, percentimeter })
        ) {
          this.shouldNotifyUpdate = true;
          await this.stateVariableRepository.create({
            state_id: this.state.state_id,
            angle,
            percentimeter,
            timestamp: new Date(timestamp)
          });
        }
      }
    }
  };

  private alterRadioVariable = async (
    pivot_id: RadioVariable['pivot_id'],
    father: RadioVariable['father'],
    rssi: RadioVariable['rssi'],
    timestamp: StateModel['timestamp']
  ) => {
    if (father !== undefined && rssi !== undefined) {
      const oldRadioVariable = await this.radioVariableRepository.findByPivotId(
        pivot_id
      );
      if (
        !oldRadioVariable ||
        isRadioVariableDifferent(oldRadioVariable, { father, rssi })
      ) {
        this.shouldNotifyUpdate = true;
        await this.radioVariableRepository.create({
          pivot_id,
          state_id: this.state!.state_id,
          father,
          rssi,
          timestamp: new Date(timestamp)
        });
      }
    }
  };

  async execute(
    pivot_id: PivotModel['pivot_id'],
    connection: StateModel['connection'],
    power: StateModel['power'],
    water: StateModel['water'],
    direction: StateModel['direction'],
    angle: StateVariable['angle'],
    percentimeter: StateVariable['percentimeter'],
    timestamp: Date,
    father: RadioVariable['father'],
    rssi: RadioVariable['rssi']
  ) {
    const oldState = await this.stateRepository.findByPivotId(pivot_id);
    this.state = oldState;

    await this.createStateIfNotExists(
      pivot_id,
      oldState,
      {
        connection,
        power,
        water,
        direction
      },
      timestamp
    );

    await this.alterStateVariable(angle, percentimeter, timestamp);
    await this.alterRadioVariable(pivot_id, father, rssi, timestamp);

    // teste

    if (this.shouldNotifyUpdate) {
      const pivot = await this.pivotRepository.findById(pivot_id);
      const node = await this.nodesRepository.findById(pivot?.node_id);
      const farm = await this.farmRepository.findById(pivot?.farm_id!!);

      emitter.emit('status', {
        farm_id: pivot?.farm_id,
        node_num: node?.node_num,
        payload: {
          pivot_id,
          connection,
          power,
          water,
          direction,
          angle,
          percentimeter,
          timestamp,
          father,
          rssi
        }
      });

      if (this.shouldNotifyState) {
        emitter.emit('state-change', {
          user_id: farm?.user_id,
          pivot_id,
          pivot_num: pivot?.pivot_num,
          farm_name: farm?.farm_name,
          power,
          water,
          direction,
          connection,
          percentimeter
        });
      } else {
        emitter.emit('variable-change', {
          user_id: farm?.user_id,
          pivot_id,
          percentimeter,
          angle
        });
      }
    }
  }
}

export { UpdatePivotStateUseCase };
