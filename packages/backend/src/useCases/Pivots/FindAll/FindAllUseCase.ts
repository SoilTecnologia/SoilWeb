import { inject, injectable } from 'tsyringe';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';

@injectable()
class FindAllUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  async execute() {
    const pivotsAdm = await this.pivotRepository.findAll();

    return pivotsAdm;
  }
}

export { FindAllUseCase };
