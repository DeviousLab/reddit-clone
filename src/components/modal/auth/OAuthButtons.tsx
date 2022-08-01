import React from 'react';
import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

import { auth } from '../../../firebase/client';

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
	const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

	return (
		<Flex direction='column' mb={4} width='100%'>
			<Button
				variant='oauth'
				mb={2}
				isLoading={loading}
				onClick={() => signInWithGoogle()}
			>
				<Image src='/images/googlelogo.png' height='20px' mr={4} alt="Google Provider login"/>
				Continue with Google
			</Button>
			<Button variant='oauth'>Some Other Provider</Button>
			<Text textAlign='center' fontSize='10pt' color='red' mt={2}>
				{error?.message}
			</Text>
		</Flex>
	);
};
export default OAuthButtons;
