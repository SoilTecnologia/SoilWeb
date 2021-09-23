import {signUpController} from '../src/controllers/user';

async function main() {
	await signUpController("super", "super", "SUDO");
}