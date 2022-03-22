import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { StateModel } from '../../../database/model/State';
import { StateVariableModel } from '../../../database/model/StateVariables';
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
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('FarmsRepository') private farmRepository: IFarmsRepository,
    @inject('NodesRepository') private nodesRepository: INodesRepository,
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariable,
    @inject('RadioVariablesRepository')
    private radioVariableRepository: IRadioVariableRepository
  ) {}

  private shouldNotifyUpdate: boolean = false;

  private shouldNotifyState: boolean = false;

  private state: StateModel | undefined;

  private createStateIfNotExists = async (
    pivot_id: StateModel['pivot_id'],
    oldState: StateModel | undefined,
    newState: HandleState
  ) => {
    const { connection, power, water, direction } = newState!!;

    const stateChanged = isStateDifferent(oldState!!, {
      connection,
      power,
      water,
      direction
    });
    if (!oldState || stateChanged) {
      this.shouldNotifyUpdate = true;
      this.shouldNotifyState = true;
      const state = await this.stateRepository.create({
        pivot_id,
        connection,
        power,
        water,
        direction,
        timestamp: new Date(newState.timestamp)
      });

      return state;
    }
  };

  private alterStateVariable = async (
    state_id: StateVariableModel['state_id'],
    angle: StateVariable['angle'],
    percentimeter: StateVariable['percentimeter'],
    timestamp: StateModel['timestamp']
  ) => {
    if (angle !== undefined && percentimeter !== undefined) {
      if (this.state) {
        const oldStateVariable =
          await this.stateVariableRepository.findByStateId(state_id);

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
    state_id: StateModel['state_id'],
    father: RadioVariable['father'],
    rssi: RadioVariable['rssi'],
    timestamp: StateModel['timestamp']
  ) => {
    if (father && rssi) {
      const oldRadioVariable = await this.radioVariableRepository.findByPivotId(
        pivot_id
      );
      if (
        !oldRadioVariable ||
        isRadioVariableDifferent(oldRadioVariable!!, { father, rssi })
      ) {
        this.shouldNotifyUpdate = true;
        await this.radioVariableRepository.create({
          pivot_id,
          state_id,
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
    const onePivot = await this.pivotRepository.findById(pivot_id);
    const farm = await this.farmRepository.findById(onePivot!!.farm_id);

    const oldState = await this.stateRepository.findByPivotId(
      onePivot!!.pivot_id
    );

    this.state = oldState;

    const handleState = {
      pivot_id,
      connection,
      power,
      water,
      direction,
      timestamp
    };

    await this.createStateIfNotExists(pivot_id, oldState, handleState);

    await this.alterStateVariable(
      oldState!!.state_id,
      angle,
      percentimeter,
      timestamp
    );

    await this.alterRadioVariable(
      pivot_id,
      oldState!!.state_id,
      father,
      rssi,
      timestamp
    );

    // teste

    if (this.shouldNotifyUpdate) {
      const pivot = await this.pivotRepository.findById(pivot_id);
      const node = await this.nodesRepository.findById(pivot!!.node_id);

      emitter.emit('status', {
        farm_id: node?.farm_id,
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
