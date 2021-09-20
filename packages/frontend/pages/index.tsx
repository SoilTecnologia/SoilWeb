import React from 'react'
import withAuth from '../lib/withAuth';
import { useSession } from 'next-auth/client';

const index = () => {
	const [session, loading] = useSession();
	console.log(session, loading)
	return (
		<div>
			<p>Oii</p>	
		</div>
	)
}

export default withAuth(index);