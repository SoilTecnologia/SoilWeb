import { inject, injectable } from 'tsyringe';
import { IActionRepository } from '../../../database/repositories/Action/IActionRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllActionByPivot {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository
  ) {}

  private async applyQueryGetAllACtions(pivot_id: string) {
    try {
      return await this.actionRepository.getNotSucessByPivot(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllActionByPivot.name,
        'Get All Actions'
      );
    }
  }

  async execute(pivot_id: string) {
    return await this.applyQueryGetAllACtions(pivot_id);
  }
}

export { GetAllActionByPivot };
