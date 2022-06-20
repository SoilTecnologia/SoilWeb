import { inject, injectable } from 'tsyringe';
import { PumpModel } from '../../../../database/model/Pump';
import { IPumpRepository } from '../../../../database/repositories/Pump/IPumpRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class UpdatePumpUseCase {
  constructor(
    @inject('PumpRepository')
    private pumpRepository: IPumpRepository
  ) {}

  private async applyQueryFindById(pump_id: string) {
    try {
      return await this.pumpRepository.findById(pump_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePumpUseCase.name,
        'Get Pump By Id'
      );
    }
  }

  private async applyQueryDelete(pump: PumpModel) {
    try {
      return await this.pumpRepository.update(pump);
    } catch (err) {
      messageErrorTryAction(err, true, UpdatePumpUseCase.name, 'Update Pump ');
    }
  }

  async execute(pump: PumpModel) {
    const getPump = await this.applyQueryFindById(pump.pump_id);

    if (!getPump) throw new Error('Pumps Does Not Exists');

    const newPump = await this.applyQueryDelete(pump);

    return newPump;
  }
}

export { UpdatePumpUseCase };
