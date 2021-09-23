import { signUpController, signInController, deleteUserController } from '../src/controllers/user';
import { User, UserType } from '@prisma/client';

type UserSignUp = Partial<User>;

describe('Sign UP', () => {
  let user: UserSignUp = {
    login: 'teste',
    password: '1234',
    user_type: 'USER'
  };

test('Correct Info', async () => {
  const data = await signUpController(
    user.login,
    user.password,
    user.user_type
  );
	if(data) user.user_id = data.user_id;
  expect(data?.token).toBeDefined();
});

test('Duplicate Info', async () => {
  expect.assertions(1);

  try {
    const data = await signUpController(
      user.login,
      user.password,
      user.user_type
    );
  } catch (e) {
    expect(e).toBeDefined();
  }
});

test('Deletion', async() => {
	const data = await deleteUserController(user.user_id);

	expect(data).toBe(true);
})
});
