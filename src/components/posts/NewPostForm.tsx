import React, { useState } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex, Icon } from '@chakra-ui/react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import {
	addDoc,
	collection,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '../../atoms/postsAtom';
import { firestore, storage } from '../../firebase/client';
import useSelectFile from '../../hooks/useSelectFile';

type NewPostFormProps = {
	user: User;
};

const formTabs: TabItem[] = [
	{
		title: 'Post',
		icon: IoDocumentText,
	},
	{
		title: 'Images & Video',
		icon: IoImageOutline,
	},
	{
		title: 'Link',
		icon: BsLink45Deg,
	},
	{
		title: 'Poll',
		icon: BiPoll,
	},
	{
		title: 'Talk',
		icon: BsMic,
	},
];

export type TabItem = {
	title: string;
	icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
	const [textInputs, setTextInputs] = useState({
		title: '',
		body: '',
	});
	const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

	const handleCreatePost = async () => {
		const { communityId } = router.query;
		const newPost: Post = {
			communityId: communityId as string,
			creatorId: user?.uid,
			creatorDisplayName: user.email!.split('@')[0],
			title: textInputs.title,
			body: textInputs.body,
			numberOfComments: 0,
			voteStatus: 0,
			createdAt: serverTimestamp() as Timestamp,
		};
    setLoading(true);
		try {
			const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
			if (selectedFile) {
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
				await uploadString(imageRef, selectedFile, 'data_url');
				const downloadURL = await getDownloadURL(imageRef);
				await updateDoc(postDocRef, { imageURL: downloadURL });
			}
      router.back();
		} catch (error: any) {
			console.log(error.message);
      setError(true);
		}
    setLoading(false);
	};

	const onTextChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {
			target: { name, value },
		} = e;
		setTextInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Flex direction='column' bg='white' borderRadius={4} mt={2}>
			<Flex width='100%'>
				{formTabs.map((item) => (
					<TabItem
						key={item.title}
						item={item}
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === 'Post' && (
					<TextInputs
						textInputs={textInputs}
						handleCreatePost={handleCreatePost}
						onChange={onTextChange}
						loading={loading}
					/>
				)}
				{selectedTab === 'Images & Video' && (
					<ImageUpload
						selectedFile={selectedFile}
						onSelectImage={onSelectFile}
						setSelectedTab={setSelectedTab}
						setSelectedFile={setSelectedFile}
					/>
				)}
			</Flex>
      {error && (
        <Alert status='error'>
        <AlertIcon />
        <AlertTitle>Error creating post</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      )}
		</Flex>
	);
};
export default NewPostForm;
