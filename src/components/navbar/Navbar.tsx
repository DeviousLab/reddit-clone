import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';

import Directory from './Directory/Directory';
import NavButtons from './NavButtons/NavButtons';
import Search from './Search';
import { auth } from '../../firebase/client';

const Navbar: React.FC = () => {
	const [user, loading, error] = useAuthState(auth);

	return (
		<Flex bg='white' height='44px' padding='6px 12px' justify={{ md: 'space-between', }}>
			<Flex align='center' width={{ base: "40px", md: "auto" }}>
        <Image src='/images/redditFace.svg' height='30px' />
        <Image src='/images/redditText.svg' height='46px' display={{ base: 'none', md: 'unset' }} />
      </Flex>
			{user && <Directory />}
      <Search user={user} />
      <NavButtons user={user} />
		</Flex>
	);
};
export default Navbar;
