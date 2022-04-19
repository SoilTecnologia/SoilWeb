import { container, inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { RadioVariableModel } from '../../../database/model/RadioVariable';
import { StateModel } from '../../../database/model/State';
import { StateVariableModel } from '../../../database/model/StateVariables';
import { HandleState } from '../../../database/model/types/state';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IRadioVariableRepository } from '../../../database/repositories/RadioVariables/IRadioVariableRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import emitter from '../../../utils/eventBus';
import {
  isRadioVariableDifferent,
  isStateDifferent,
  isStateVariableDifferent
} from '../../../utils/isDifferent';
import { messageErrorTryAction } from '../../../utils/types';
import { CreateStateUseCase } from '../../States/CreateStateUseCase';

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
    private stateVariableRepository: IStatesVariableRepository,
    @inject('RadioVariablesRepository')
    private radioVariableRepository: IRadioVariableRepository
  ) {
    this.shouldNotifyUpdate = false;
    this.shouldNotifyState = false;
    this.state = undefined;
  }

  // Queries Database
  private async applyQueryGetStateByPivot(pivot_id: string) {
    try {
      return await this.stateRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Find State By pivot Id'
      );
    }
  }

  private async applyQueryGetNodeByNode(node_id: string) {
    try {
      return await this.nodesRepository.findById(node_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Find Node By node Id'
      );
    }
  }

  private async applyQueryGetFarmByFarm(farm_id: string) {
    try {
      return await this.farmRepository.findById(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Find Farm By Farm Id'
      );
    }
  }

  private async applyQueryGetPivotById(pivot_id: string) {
    try {
      return await this.pivotRepository.findById(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Find Pivot By Pivot Id'
      );
    }
  }

  private async applyQueryGetRadioVariable(pivot_id: string) {
    try {
      return await this.radioVariableRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Find RadioVariable By Pivot Id'
      );
    }
  }

  private async applyQueryCreateRadioVariable(
    radio: Omit<RadioVariableModel, 'radio_variable_id'>
  ) {
    try {
      return await this.radioVariableRepository.create(radio);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Create RadioVariable '
      );
    }
  }

  private async applyQueryGetStateVariable(state_id: string) {
    try {
      return await this.stateVariableRepository.findByStateId(state_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Find State Variable By State Id'
      );
    }
  }

  private async applyQueryCreateStateVariable(
    state: Omit<StateVariableModel, 'state_variable_id'>
  ) {
    try {
      return await this.stateVariableRepository.create(state);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotStateUseCase.name,
        'Create State Variable '
      );
    }
  }

  // Methods Actions
  private createStateIfNotExists = async (
    pivot_id: StateModel['pivot_id'],
    oldState: StateModel | undefined,
    newState: HandleState,
    timestamp: Date
  ) => {
    if (!oldState || isStateDifferent(oldState, newState)) {
      this.shouldNotifyUpdate = true;
      this.shouldNotifyState = true;
      console.log(oldState);
      console.log(newState);

      const createStateUseCase = container.resolve(CreateStateUseCase);

      this.state = await createStateUseCase.execute({
        pivot_id,
        connection: newState.connection,
        power: newState.power,
        water: newState.water,
        direction: newState.direction,
        timestamp: new Date()
      });

      console.log('STATE IS CREATED IN DATABASE');
    }
  };

  private alterStateVariable = async (
    angle: StateVariableModel['angle'],
    percentimeter: StateVariableModel['percentimeter'],
    timestamp: StateModel['timestamp']
  ) => {
    if (angle !== undefined && percentimeter !== undefined) {
      if (this.state) {
        const oldStateVariable = await this.applyQueryGetStateVariable(
          this.state.state_id
        );

        if (
          !oldStateVariable ||
          isStateVariableDifferent(oldStateVariable, { angle, percentimeter })
        ) {
          this.shouldNotifyUpdate = true;
          const stateVariable = await this.applyQueryCreateStateVariable({
            state_id: this.state.state_id,
            angle,
            percentimeter,
            timestamp: new Date()
          });

          if (stateVariable) {
            console.log('STATE VARIABLE IS CREATED IN DATABASE');
          }
        }
      }
    }
  };

  private alterRadioVariable = async (
    pivot_id: RadioVariableModel['pivot_id'],
    father: RadioVariableModel['father'],
    rssi: RadioVariableModel['rssi'],
    timestamp: StateModel['timestamp']
  ) => {
    if (father !== undefined && rssi !== undefined) {
      const oldRadioVariable = await this.applyQueryGetRadioVariable(pivot_id);
      if (
        !oldRadioVariable ||
        isRadioVariableDifferent(oldRadioVariable, { father, rssi })
      ) {
        this.shouldNotifyUpdate = true;
        const radioVariable = await this.applyQueryCreateRadioVariable({
          pivot_id,
          state_id: this.state!.state_id,
          father,
          rssi,
          timestamp: new Date(timestamp)
        });

        if (radioVariable) {
          console.log('RADIO VARIABLE IS CREATED IN DATABASE');
        }
      }
    }
  };

  async execute(
    pivot_id: PivotModel['pivot_id'],
    connection: StateModel['connection'],
    power: StateModel['power'],
    water: StateModel['water'],
    direction: StateModel['direction'],
    angle: StateVariableModel['angle'],
    percentimeter: StateVariableModel['percentimeter'],
    timestamp: Date,
    father: RadioVariableModel['father'],
    rssi: RadioVariableModel['rssi']
  ) {
    const oldState = await this.applyQueryGetStateByPivot(pivot_id);
    this.state = oldState;

    const newState = { connection, power, water, direction };

    await this.createStateIfNotExists(pivot_id, oldState, newState, timestamp);
    await this.alterStateVariable(angle, percentimeter, timestamp);
    await this.alterRadioVariable(pivot_id, father, rssi, timestamp);

    // teste

    if (this.shouldNotifyUpdate) {
      const pivot = await this.applyQueryGetPivotById(pivot_id);
      if (!pivot) throw new Error('Pivot Does Not Find');
      const node = await this.applyQueryGetNodeByNode(pivot.node_id!!);
      const farm = await this.applyQueryGetFarmByFarm(pivot.farm_id!!);

      if (!farm) throw new Error('Farm does Not Find');

      emitter.emit('status', {
        farm_id: pivot?.farm_id,
        node_num: node?.node_num,
        payload: {
          pivot_id: pivot?.pivot_id,
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
      }
      if (this.shouldNotifyUpdate) {
        emitter.emit('variable-change', {
          user_id: farm?.user_id,
          pivot_id,
          percentimeter,
          angle
        });
      }
    }

    return this.state;
  }
}

export { UpdatePivotStateUseCase };
