import { Knex } from 'knex';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '../src/useCases/User/CreateUser/CreateUserUseCase';

// Insere um usuário SUDO para os administradores Soil

export async function seed(knex: Knex): Promise<void> {
  const createUserUseCase = container.resolve(CreateUserUseCase);
  await createUserUseCase.execute({
    login: 'sudo',
    password: '1234',
    user_type: 'SUDO'
  }
   
  );
}
