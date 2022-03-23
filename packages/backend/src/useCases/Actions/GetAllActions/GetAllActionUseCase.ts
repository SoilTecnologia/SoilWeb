import { inject, injectable } from 'tsyringe';
import { IActionRepository } from '../../../database/repositories/Action/IActionRepository';

@injectable()
class GetAllActionsUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository
  ) {}

  async execute() {
    const actions = await this.actionRepository.getNotSucess();

    return actions;
  }
}

export { GetAllActionsUseCase };
