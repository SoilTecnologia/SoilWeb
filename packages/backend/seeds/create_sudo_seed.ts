
import { Knex } from "knex";
import User from '../src/models/user';
import { signUpController } from "../src/controllers/users";

// Insere um usuário SUDO para os administradores Soil

export async function seed(knex: Knex): Promise<void> {
    await signUpController('sudo', '1234', 'SUDO')
};
