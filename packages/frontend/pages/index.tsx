import React from 'react';
import withAuth from '../lib/withAuth';
import { useSession } from 'next-auth/client';
import Header from '../components/Header';

const index = () => {
  const [session, loading] = useSession();
  console.log(session, loading);
  return (
    <div>
      <Header>
				<h4>FAZENDAS</h4>
			</Header>

      <div className="bg-primary font-sans rounded-md text-xl text-white flex p-8 m-16">
        <div className="flex-col flex-grow">
          <h4>Fazenda: Santa Rita</h4>
          <h4>Cidade: Santa Rita do Sapucaí - MG</h4>
        </div>
        <button className="text-2xl">ENTRAR</button>
      </div>
    </div>
  );
};

export default withAuth(index);
