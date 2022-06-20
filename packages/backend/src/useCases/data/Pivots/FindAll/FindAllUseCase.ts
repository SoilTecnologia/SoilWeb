import { inject, injectable } from 'tsyringe';
import { IPivotsRepository } from '../../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class FindAllUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  private async applyQueryGetAll() {
    try {
      return await this.pivotRepository.findAll();
    } catch (error) {
      messageErrorTryAction(error, true, FindAllUseCase.name, 'Get All Pivots');
    }
  }

  async execute() {
    return await this.applyQueryGetAll();
  }
}

export { FindAllUseCase };
