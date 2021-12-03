
import { Knex } from "knex";
import User from '../src/models/users';
import { signUpController } from "../src/controllers/users";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await signUpController('sudo', '1234', 'SUDO')
};
