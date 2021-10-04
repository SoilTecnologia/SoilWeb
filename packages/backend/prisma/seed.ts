import { signUpController } from '../src/controllers/user';

async function main() {
  await signUpController('sudo', '1234', 'SUDO');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
