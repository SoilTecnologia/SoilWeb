import { inject, injectable } from 'tsyringe';
import { PumpModel } from '../../../database/model/Pump';
import { IPumpRepository } from '../../../database/repositories/Pump/IPumpRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetPumpUseCase {
  constructor(
    @inject('PumpRepository')
    private pumpRepository: IPumpRepository
  ) {}

  private async applyQueryGetByPivot(pump_id: string) {
    try {
      return await this.pumpRepository.findByPivotId(pump_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetPumpUseCase.name,
        'Get Pump By Pivot Id'
      );
    }
  }

  async execute(pump_id: PumpModel['pump_id']) {
    const getPump = await this.applyQueryGetByPivot(pump_id);

    return getPump;
  }
}

export { GetPumpUseCase }