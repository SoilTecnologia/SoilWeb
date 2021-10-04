import React from 'react'
import withAuth from '../lib/withAuth';
import { useSession } from 'next-auth/client';
import {Header} from '../styles/common/Header';
import { Card3D } from '../styles/common/Cards';

const index = () => {
	const [session, loading] = useSession();
	console.log(session, loading)
	return (
		<div>
			<Header>
				<h1>FAZENDAS</h1>
			</Header>

			<Card3D>Oiue</Card3D>
		</div>
	)
}

export default withAuth(index);