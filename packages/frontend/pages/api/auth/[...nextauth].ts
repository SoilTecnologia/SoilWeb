import NextAuth from 'next-auth';
import { session, signin, signIn } from 'next-auth/client';
import axios from 'axios';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  session: {
    jwt: true,
    maxAge: 60 * 60 * 3
  },
  providers: [
    Providers.Credentials({
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await axios.post('http://localhost:3308/user/signin', {
          login: credentials.username,
          password: credentials.password
        });

        const user = res.data;
        // If no error and we have user data, return it
        if (res.status == 200 && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      }
    })
  ],
  callbacks: {
    async redirect(url, baseUrl) {
      return '/';
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        token.user_id = user.user_id;
        token.user_type = user.user_type;
        token.acessToken = user.token;
      }
      return token;
    },
    async session(session, userOrToken) {
      const { user_id, user_type } = userOrToken;

      session.user = { user_id, user_type };
      session.token = userOrToken.acessToken;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
});
