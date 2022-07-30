import React, { useEffect, useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Community } from '../../atoms/communitiesAtom';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/client';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
	communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
	const [user] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const {
		postStateValue,
		setPostStateValue,
		onVote,
		onDeletePost,
		onSelectPost,
	} = usePosts();
	const getPosts = async () => {
		try {
      setLoading(true);
			const postQuery = query(
				collection(firestore, 'posts'),
				where('communityId', '==', communityData.id),
				orderBy('createdAt', 'desc')
			);
			const postDocs = await getDocs(postQuery);
			const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
		} catch (error: any) {
			console.log(error.message);
		}
    setLoading(false);
	};

	useEffect(() => {
		getPosts();
	}, []);

	return (
		<>
			{loading ? (
				<PostLoader />
			) : (
				<Stack>
					{postStateValue.posts.map((item) => (
						<PostItem
              key={item.id}
							post={item}
							userIsCreator={user?.uid === item.creatorId}
							userVoteValue={undefined}
							onVote={onVote}
							onDeletePost={onDeletePost}
							onSelectPost={onSelectPost}
						/>
					))}
				</Stack>
			)}
		</>
	);
};
export default Posts;
