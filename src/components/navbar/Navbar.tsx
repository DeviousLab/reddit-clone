import { Flex, Image } from '@chakra-ui/react';
import React from 'react';

import Directory from './Directory';
import NavButtons from './NavButtons/NavButtons';
import Search from './Search';

const Navbar: React.FC = () => {
	return (
		<Flex bg='white' height='44px' padding='6px 12px'>
			<Flex align='center'>
        <Image src='/images/redditFace.svg' height='30px' />
        <Image src='/images/redditText.svg' height='46px' display={{ base: 'none', md: 'unset' }} />
      </Flex>
			{/* <Directory /> */}
      <Search />
      <NavButtons />
		</Flex>
	);
};
export default Navbar;
