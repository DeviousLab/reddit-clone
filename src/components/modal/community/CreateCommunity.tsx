import React, { useState } from 'react';
import {
	Box,
	Button,
	Checkbox,
	Divider,
	Flex,
	Icon,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
} from '@chakra-ui/react';
import { HiLockClosed } from 'react-icons/hi';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';

import { auth, firestore } from '../../../firebase/client';
import { communityState } from '../../../atoms/communitiesAtom';
import useDirectory from '../../../hooks/useDirectory';

type CreateCommunityProps = {
	open: boolean;
	handleClose: () => void;
};

const CreateCommunity: React.FC<CreateCommunityProps> = ({
	open,
	handleClose,
}) => {
	const [user] = useAuthState(auth);
	const setSnippetState = useSetRecoilState(communityState);
	const [communityName, setCommunityName] = useState('');
	const [charsRemaining, setCharsRemaining] = useState(21);
	const [communityType, setCommunityType] = useState('public');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { toggleDirectory } = useDirectory();

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 21) return;

		setCommunityName(e.target.value);
		setCharsRemaining(21 - e.target.value.length);
	};

	const onCommunityTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommunityType(e.target.name);
	};

	const handleCreateCommunity = async () => {
		if (error) setError('');
		const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (format.test(communityName)) {
			setError('Community name cannot contain special characters');
			return;
		}
		if (communityName.length < 3) {
			setError('Community name must be at least 3 characters');
			return;
		}
		setLoading(true);
		try {
			const communityDocRef = doc(firestore, 'communities', communityName);
			await runTransaction(firestore, async (transaction) => {
				const communityDoc = await transaction.get(communityDocRef);
				if (communityDoc.exists()) {
					throw new Error (`Community r/${communityName} already exists`);
				}
				transaction.set(communityDocRef, {
					creatorId: user?.uid,
					createdAt: serverTimestamp(),
					numberOfReaders: 1,
					privacyType: communityType,
				});
				transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
					communityId: communityName,
					isModerator: true,
				})
			})
		} catch (error: any) {
      console.error(error);
      setError(error.message);
    }
		setSnippetState((prev) => ({
			...prev,
			mySnippets: [],
		}));
		handleClose();
		toggleDirectory();
		setLoading(false);
		router.push(`/r/${communityName}`);
	};

	return (
		<>
			<Modal isOpen={open} onClose={handleClose} size='lg'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display='flex'
						flexDirection='column'
						fontSize={15}
						padding={3}
					>
						Create a community
					</ModalHeader>
					<Box pl={3} pr={3}>
						<Divider />
						<ModalCloseButton />
						<ModalBody display='flex' flexDirection='column' padding='10px 0px'>
							<Text fontWeight={600} fontSize={15}>
								Name
							</Text>
							<Text fontSize={11} color='gray.500'>
								Community names including capitalisation cannot be changed.
							</Text>
							<Text
								position='relative'
								top='28px'
								left='10px'
								width='20px'
								color='gray.400'
							>
								r/
							</Text>
							<Input
								value={communityName}
								size='sm'
								pl='22px'
								position='relative'
								border='1px solid'
								borderColor={charsRemaining === 0 ? 'red' : ''}
								onChange={handleChange}
							/>
							<Text
								fontSize='9pt'
								color={charsRemaining === 0 ? 'red' : 'gray.500'}
							>
								{charsRemaining} Characters remaining
							</Text>
							<Text fontSize='9pt' color='red' pt={1}>
								{error}
							</Text>
							<Box mt={4} mb={4}>
								<Text fontWeight={600} fontSize={15}>
									Community Type
								</Text>
								<Stack spacing={2}>
									<Checkbox
										name='public'
										isChecked={communityType === 'public'}
										onChange={onCommunityTypeChange}
									>
										<Flex align='center'>
											<Icon as={BsFillEyeFill} color='gray.500' mr={2} />
											<Text fontSize='10pt' mr={1}>
												Public
											</Text>
											<Text fontSize='8pt' color='gray.500'>
												Anyone can view, post and comment to this community
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										name='restricted'
										isChecked={communityType === 'restricted'}
										onChange={onCommunityTypeChange}
									>
										<Flex align='center'>
											<Icon as={BsFillPersonFill} color='gray.500' mr={2} />
											<Text fontSize='10pt' mr={1}>
												Restricted
											</Text>
											<Text fontSize='8pt' color='gray.500'>
												Anyone can view this community, but only approved users
												can post
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										name='private'
										isChecked={communityType === 'private'}
										onChange={onCommunityTypeChange}
									>
										<Flex align='center'>
											<Icon as={HiLockClosed} color='gray.500' mr={2} />
											<Text fontSize='10pt' mr={1}>
												Private
											</Text>
											<Text fontSize='8pt' color='gray.500'>
												Only approved users can view and submit to this
												community
											</Text>
										</Flex>
									</Checkbox>
								</Stack>
							</Box>
						</ModalBody>
					</Box>
					<ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
						<Button
							variant='outline'
							height='30px'
							mr={3}
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button height='30px' onClick={handleCreateCommunity} isLoading={loading}>
							Create Community
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default CreateCommunity;
