import React from 'react';
import {
	Flex,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';

import { authModalState } from '../../../atoms/authModalAtom';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';

const AuthModal: React.FC = () => {
	const [modalState, setModalState] = useRecoilState(authModalState);

	const handleClose = () => {
		setModalState((prev) => ({ ...prev, open: false }));
	};

	return (
		<>
			<ModalHeader display='flex' flexDirection='column' alignItems='center'>
				{modalState.variant === 'signin' && 'Log in'}
				{modalState.variant === 'signup' && 'Sign Up'}
				{modalState.variant === 'forgot-password' && 'Reset your password'}
			</ModalHeader>
			<ModalCloseButton />
			<ModalBody
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
				pb={6}
			>
				<Flex
					direction='column'
					alignItems='center'
					justifyContent='center'
					width='70%'
				>
          <OAuthButtons />
          <AuthInputs />
          {/* <ForgotPassword /> */}
        </Flex>
			</ModalBody>
		</>
	);
};
export default AuthModal;
