import React, { useState } from 'react';
import { Flex, Text, Button, Input } from '@chakra-ui/react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

import { authModalState } from '../../../atoms/authModalAtom';
import { auth } from '../../../firebase/client';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

type LoginProps = {
  
};

const Login:React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        placeholder="email"
        type="text"
        mb={2}
        onChange={handleChange}
        required
      />
      <Input
        name="password"
        placeholder="password"
        type="password"
        onChange={handleChange}
        required
      />
      <Text textAlign="center" mt={2} fontSize="10pt" color="red">
        {FIREBASE_ERRORS[error?.message!]}
      </Text>
      <Button
        width="100%"
        height="36px"
        mb={2}
        mt={2}
        type="submit"
        isLoading={loading}
      >
        Log In
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() => setAuthModalState((prev) => ({
            ...prev,
            variant: "forgot-password",
          }))}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              variant: "signup",
            }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
}
export default Login;