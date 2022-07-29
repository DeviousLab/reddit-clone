import { Button, Flex } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import React from 'react';

import AuthButtons from './AuthButtons';
import { auth } from '../../../firebase/client';

type NavButtonsProps = {
  user: any;
};

const NavButtons:React.FC<NavButtonsProps> = ({ user }) => {
  return (
    <>
      <Flex justify='center' align='center'>
        {user ? <Button onClick={() => signOut(auth)}>Logout</Button> : <AuthButtons />}
      </Flex>
    </>
  )
}
export default NavButtons;