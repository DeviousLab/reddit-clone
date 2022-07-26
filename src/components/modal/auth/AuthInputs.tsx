import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { authModalState } from '../../../atoms/authModalAtom';
import Login from './Login';
import Register from './Register';

type AuthInputsProps = {
  
};

const AuthInputs:React.FC<AuthInputsProps> = () => {
  const modalState = useRecoilValue(authModalState);
  return (
    <Flex direction="column" alignItems="center" width="100%" mt={4}>
    {modalState.variant === "signin" ? (
      <Login />
    ) : (
      <Register />
    )}
  </Flex>
  )
}
export default AuthInputs;