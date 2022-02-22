import React, { useState } from 'react';
import {useRouter} from 'next/router';
import type { NextPage } from 'next';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useSession, signIn, signOut } from 'next-auth/client';
import { getSession } from 'next-auth/client';
import { getCsrfToken } from 'next-auth/client';
import { FaLock, FaUser } from 'react-icons/fa';

const Home: NextPage = ({ csrfToken }) => {
  const router = useRouter();
    const [session, loading] = useSession();

  async function handleSubmit(event) {
    event.preventDefault();
    const { username, password } = event.target;

    signIn('credentials', { username: username.value, password: password.value });
  }

  if (session) {
    router.push('/');
  }

  return (
    <div className="h-screen bg-primary flex flex-col items-center justify-center">
      <div className="bg-secondary p-8 w-3/4 max-w-2xl text-center rounded-xl hover:shadow-2xl transition-all duration-700">
        <div>
          <img
            src="/logos/logo-dark.png"
            alt="Logo da Empresa Soil"
            width="224"
            height="130"
            placeholder="blur"
            className="mx-auto"
          />
          <form onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="flex m-8">
              <FaUser className="m-4 shadow-2xl " />
              <input
                className="rounded-xl text-center w-full"
                name="username"
                type="text"
                placeholder="USUÁRIO"
              />
            </div>
            <div className="flex m-8">
              <FaLock className="m-4 shadow-2xl" />
              <input
                className="rounded-xl shadow-sm text-center w-full"
                name="password"
                type="password"
                placeholder="SENHA"
              />
            </div>

            <button
              className="bg-primary p-4 rounded-xl"
              type="submit"
              value="ENVIAR"
            >
              ENVIAR
            </button>
          </form>
        </div>
      </div>

      <div className="w-full h-1/4 text-3xl flex justify-center items-center fixed bottom-0">
        <h2 className="p-8">TECNOLOGIA PARA IRRIGAÇÃO</h2>
      </div>
    </div>
  );
};

export default Home;
