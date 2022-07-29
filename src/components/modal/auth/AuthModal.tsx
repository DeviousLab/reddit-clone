import React, { useEffect } from 'react';
import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	ModalOverlay,
	ModalContent,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { useAuthState } from 'react-firebase-hooks/auth';

import { authModalState } from '../../../atoms/authModalAtom';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { auth } from '../../../firebase/client';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [user, loading, error] = useAuthState(auth);

	useEffect(() => {
		if (user) {
			handleClose();
		}
	}, [user]);

	const handleClose = () => {
		setModalState((prev) => ({ ...prev, open: false }));
	};

	return (
		<>
			<Modal isOpen={modalState.open} onClose={handleClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display='flex'
						flexDirection='column'
						alignItems='center'
					>
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
							{modalState.variant === 'signin' ||
							modalState.variant === 'signup' ? (
								<>
									<OAuthButtons />
									OR
									<AuthInputs />
								</>
							) : (
								<ResetPassword />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
export default AuthModal;
