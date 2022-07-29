import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import Directory from './Directory';
import NavButtons from './NavButtons/NavButtons';
import Search from './Search';
import { auth } from '../../firebase/client';

const Navbar: React.FC = () => {
	const [user, loading, error] = useAuthState(auth);

	return (
		<Flex bg='white' height='44px' padding='6px 12px'>
			<Flex align='center'>
        <Image src='/images/redditFace.svg' height='30px' />
        <Image src='/images/redditText.svg' height='46px' display={{ base: 'none', md: 'unset' }} />
      </Flex>
			{/* <Directory /> */}
      <Search />
      <NavButtons user={user} />
		</Flex>
	);
};
export default Navbar;
