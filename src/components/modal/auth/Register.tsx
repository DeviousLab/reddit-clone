import { Flex, Text, Button, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { authModalState } from '../../../atoms/authModalAtom';
import { auth } from '../../../firebase/client';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

type RegisterProps = {
  
};

const Register:React.FC<RegisterProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formError) setFormError('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError('Passwords do not match!');
      return;
    }
    createUserWithEmailAndPassword(registerForm.email, registerForm.password);
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
      <Input
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        onChange={handleChange}
        required
      />
      <Text textAlign="center" mt={2} fontSize="10pt" color="red">
        {formError || FIREBASE_ERRORS[error?.message!]}
      </Text>
      <Button
        width="100%"
        height="36px"
        mb={2}
        mt={2}
        type="submit"
        isLoading={loading}
      >
        Sign Up
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
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              variant: "signin",
            }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
}
export default Register;