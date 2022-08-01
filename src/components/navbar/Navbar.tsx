import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';

import Directory from './Directory/Directory';
import NavButtons from './NavButtons/NavButtons';
import Search from './Search';
import { auth } from '../../firebase/client';
import useDirectory from '../../hooks/useDirectory';
import { defaultDirectoryMenuItem } from '../../atoms/directoryMenuAtom';

const Navbar: React.FC = () => {
	const [user, loading, error] = useAuthState(auth);
	const { onSelectMenuItem } = useDirectory();
	return (
		<Flex bg='white' height='44px' padding='6px 12px' justify={{ md: 'space-between', }}>
			<Flex align='center' width={{ base: "40px", md: "auto" }} cursor="pointer" onClick={() => onSelectMenuItem(defaultDirectoryMenuItem)}>
        <Image src='/images/redditFace.svg' height='30px' alt="Reddit Alien logo" />
        <Image src='/images/redditText.svg' height='46px' alt="Reddit Word logo" display={{ base: 'none', md: 'unset' }} />
      </Flex>
			{<Directory />}
      <Search user={user} />
      <NavButtons user={user} />
		</Flex>
	);
};
export default Navbar;
