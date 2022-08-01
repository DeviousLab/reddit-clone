import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
	IoArrowDownCircleOutline,
	IoArrowDownCircleSharp,
	IoArrowRedoOutline,
	IoArrowUpCircleOutline,
	IoArrowUpCircleSharp,
	IoBookmarkOutline,
} from 'react-icons/io5';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Flex,
	Icon,
	Image,
	Skeleton,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';

import { Post } from '../../atoms/postsAtom';

type PostItemProps = {
	post: Post;
	userIsCreator: boolean;
	userVoteValue?: number;
	onVote: (
		e: React.MouseEvent<SVGElement, MouseEvent>,
		post: Post,
		vote: number,
		communityId: string
	) => void;
	onDeletePost: (post: Post) => Promise<boolean>;
	onSelectPost?: (post: Post) => void;
};

const PostItem: React.FC<PostItemProps> = ({
	post,
	userIsCreator,
	userVoteValue,
	onDeletePost,
	onSelectPost,
	onVote,
}) => {
	const [loadingImage, setLoadingImage] = useState(true);
	const [error, setError] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);

	const singlePostPage = !onSelectPost;
	const router = useRouter();

	const handleDelete = async (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.stopPropagation();
		setLoadingDelete(true);
		try {
			const success = await onDeletePost(post);
			if (!success) {
				throw new Error('Failed to delete post');
			}
			if (singlePostPage) {
				router.back();
			}
		} catch (error: any) {
			setError(error.message);
		}
		setLoadingDelete(false);
	};

	return (
		<Flex
			border='1px solid'
			bg='white'
			borderColor={singlePostPage ? 'white' : 'gray.300'}
			borderRadius={singlePostPage ? '4px 4px 0px 0px' : 4}
			cursor={singlePostPage ? 'unset' : 'pointer'}
			_hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
			onClick={() => onSelectPost && onSelectPost(post)}
		>
			<Flex
				direction='column'
				align='center'
				bg={singlePostPage ? 'none' : 'gray.100'}
				borderRadius={singlePostPage ? '0' : '3px 0px 0px 3px'}
				p={2}
				width='40px'
			>
				<Icon
					as={
						userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
					}
					color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
					fontSize={22}
					cursor='pointer'
					onClick={(e) => onVote(e, post, 1, post.communityId)}
				/>
				<Text fontSize='9pt' fontWeight={600}>
					{post.voteStatus}
				</Text>
				<Icon
					as={
						userVoteValue === -1
							? IoArrowDownCircleSharp
							: IoArrowDownCircleOutline
					}
					color={userVoteValue === -1 ? '#4379FF' : 'gray.400'}
					fontSize={22}
					cursor='pointer'
					onClick={(e) => onVote(e, post, -1, post.communityId)}
				/>
			</Flex>
			<Flex direction='column' width='100%'>
				{error && (
					<Alert status='error'>
						<AlertIcon />
						<AlertTitle>Error creating post</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<Stack spacing={1} p='10px 10px'>
					{post.createdAt && (
						<Stack direction='row' spacing={0.6} align='center' fontSize='9pt'>
							<Text color='gray.500'>
								Posted by u/{post.creatorDisplayName}{' '}
								{moment(post.createdAt?.seconds * 1000).fromNow()}
							</Text>
						</Stack>
					)}
					<Text fontSize='12pt' fontWeight={600}>
						{post.title}
					</Text>
					<Text fontSize='10pt'>{post.body}</Text>
					{post.imageURL && (
						<Flex justify='center' align='center' p={2}>
							{loadingImage && (
								<Skeleton height='200px' width='100%' borderRadius={4} />
							)}
							<Image
								maxHeight='460px'
								src={post.imageURL}
								alt='Post Image'
								onLoad={() => setLoadingImage(false)}
								display={loadingImage ? 'none' : 'unset'}
							/>
						</Flex>
					)}
				</Stack>
				<Flex ml={1} mb={0.5} color='gray.500' fontWeight={600}>
					<Flex
						align='center'
						p='8px 10px'
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor='pointer'
					>
						<Icon as={BsChat} mr={2} />
						<Text fontSize='9pt'>{post.numberOfComments}</Text>
					</Flex>
					<Flex
						align='center'
						p='8px 10px'
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor='pointer'
					>
						<Icon as={IoArrowRedoOutline} mr={2} />
						<Text fontSize='9pt'>Share</Text>
					</Flex>
					<Flex
						align='center'
						p='8px 10px'
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor='pointer'
					>
						<Icon as={IoBookmarkOutline} mr={2} />
						<Text fontSize='9pt'>Save</Text>
					</Flex>
					{userIsCreator && (
						<Flex
							align='center'
							p='8px 10px'
							borderRadius={4}
							_hover={{ bg: 'gray.200' }}
							cursor='pointer'
							onClick={handleDelete}
						>
							{loadingDelete ? (
								<Spinner size='sm' />
							) : (
								<>
									<Icon as={AiOutlineDelete} mr={2} />
									<Text fontSize='9pt'>Delete</Text>
								</>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
export default PostItem;
