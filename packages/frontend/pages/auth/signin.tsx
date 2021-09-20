import React, { useState } from 'react';
import type { NextPage } from 'next';
import Router from 'next/router';
import {
  LoginBox,
  Logo,
  InputContainer,
  InputIcon,
  InputField,
  LoginButton
} from '../../styles/pages/signin';
import { ThemeType } from '../../styles/global';
import FlexContainer from '../../styles/common/FlexContainer';
import LogoDark from '../../public/logos/logo-dark.png';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/client';
import { getSession } from 'next-auth/client';
import { getCsrfToken } from 'next-auth/client';

type Props = {
  theme: ThemeType;
};

const Home: NextPage<Props> = ({session, csrfToken}) => {

  async function handleSubmit(event) {
    event.preventDefault();
    const {login, password} = event.target

    signIn("credentials", {login: login.value, password: password.value})
  }

  if (session) {
    console.log('SESSION!');
  } else {
    console.log('NOSESSION');
  }

  return (
    <>
      <FlexContainer height="80vh">
        <LoginBox>
          <Logo
            src={LogoDark}
            alt="Logo da Empresa Soil"
            width="224"
            height="130"
            placeholder="blur"
          />
          <form onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <InputContainer>
              <InputIcon icon={faUser} />
              <InputField name="login" type="text" placeholder="USUÁRIO" />
            </InputContainer>
            <InputContainer>
              <InputIcon icon={faLock} />
              <InputField name="password" type="password" placeholder="SENHA" />
            </InputContainer>

            <LoginButton type="submit" value="ENVIAR" />
          </form>
        </LoginBox>
      </FlexContainer>

      <FlexContainer width="100%" height="20vh">
        <h2 style={{ width: '50%' }}>TECNOLOGIA PARA IRRIGAÇÃO</h2>
      </FlexContainer>
    </>
  );
};

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await getSession(ctx),
      csrfToken: await getCsrfToken(ctx)
    }
  };
}

export default Home;
