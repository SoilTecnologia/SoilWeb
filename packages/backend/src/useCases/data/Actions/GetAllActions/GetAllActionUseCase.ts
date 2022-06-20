import { inject, injectable } from 'tsyringe';
import { IActionRepository } from '../../../../database/repositories/Action/IActionRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetAllActionsUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository
  ) {}

  private async applyQueryGetAllACtions() {
    try {
      return await this.actionRepository.getNotSucess();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllActionsUseCase.name,
        'Get All Actions'
      );
    }
  }

  async execute() {
    return await this.applyQueryGetAllACtions();
  }
}

export { GetAllActionsUseCase };
