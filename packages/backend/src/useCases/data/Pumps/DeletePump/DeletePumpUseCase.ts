import { inject, injectable } from 'tsyringe';
import { PumpModel } from '../../../../database/model/Pump';
import { IPumpRepository } from '../../../../database/repositories/Pump/IPumpRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class DeletePumpUseCase {
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
        DeletePumpUseCase.name,
        'get pump by id'
      );
    }
  }

  private async applyQueryDelete(pump_id: string) {
    try {
      return await this.pumpRepository.delete(pump_id);
    } catch (err) {
      messageErrorTryAction(err, true, DeletePumpUseCase.name, 'Delete Pump');
    }
  }

  async execute(pump_id: PumpModel['pump_id']) {
    const pump = await this.applyQueryFindById(pump_id);

    if (!pump) throw new Error('Pumo does not exist');
    return await this.applyQueryDelete(pump_id);
  }
}
export { DeletePumpUseCase };
