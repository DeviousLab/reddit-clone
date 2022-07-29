import { Button, Flex } from '@chakra-ui/react';
import { signOut, User } from 'firebase/auth';
import React from 'react';

import AuthButtons from './AuthButtons';
import { auth } from '../../../firebase/client';
import Icons from './Icons';
import UserMenu from './UserMenu';

type NavButtonsProps = {
  user?: User | null;
};

const NavButtons:React.FC<NavButtonsProps> = ({ user }) => {
  return (
    <>
      <Flex justify='center' align='center'>
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu />
      </Flex>
    </>
  )
}
export default NavButtons;