import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useAuthState } from 'react-firebase-hooks/auth';

import PageContent from '../components/layout/PageContext';
import { auth, firestore } from '../firebase/client';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import usePosts from '../hooks/usePosts';
import { Post, PostVote } from '../atoms/postsAtom';
import PostLoader from '../components/posts/PostLoader';
import { Stack } from '@chakra-ui/react';
import PostItem from '../components/posts/PostItem';
import CreatePostLink from '../components/community/CreatePostLink';
import useCommunityData from '../hooks/useCommunityData';
import Recommendations from '../components/community/Recommendations';
import Premium from '../components/community/Premium';
import PersonalHome from '../components/community/PersonalHome';

const Home: NextPage = () => {
	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const { communityStateValue } = useCommunityData();
	const {
		setPostStateValue,
		postStateValue,
		onDeletePost,
		onSelectPost,
		onVote,
	} = usePosts();

	const buildUserHomeFeed = async () => {
		setLoading(true);
		try {
			if (communityStateValue.mySnippets.length) {
				const myCommunityIds = communityStateValue.mySnippets.map(
					(snippet) => snippet.communityId
				);

				const postQuery = query(
					collection(firestore, 'posts'),
					where('communityId', 'in', myCommunityIds),
					limit(10)
				);
				const postDocs = await getDocs(postQuery);
				const posts = postDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
			} else {
				buildNoUserHomeFeed();
			}
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const buildNoUserHomeFeed = async () => {
		setLoading(true);
		try {
			const postQuery = query(
				collection(firestore, 'posts'),
				orderBy('voteStatus', 'desc'),
				limit(10)
			);
			const postDocs = await getDocs(postQuery);
			const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

			setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const getUserPostVotes = async () => {
		try {
			const postIds = postStateValue.posts.map((post) => post.id);
			const postVotesQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where('postId', 'in', postIds)
			);
			const postVoteDocs = await getDocs(postVotesQuery);
			const postVotes = postVoteDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostStateValue((prev) => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!user && !loadingUser) {
			buildNoUserHomeFeed();
		}
	}, [user, loadingUser]);

	useEffect(() => {
		if (communityStateValue.snippetsFetched) {
			buildUserHomeFeed();
		}
	}, [communityStateValue.snippetsFetched]);

	useEffect(() => {
		if (user && postStateValue.posts.length) {
			getUserPostVotes();
		}
		return () => {
			setPostStateValue((prev) => ({ ...prev, postVotes: [] }));
		};
	}, [user, postStateValue.posts]);

	return (
		<PageContent>
			<>
				<CreatePostLink />
				{loading ? (
					<PostLoader />
				) : (
					<Stack>
						{postStateValue.posts.map((post) => (
							<PostItem
								key={post.id}
								post={post}
								onSelectPost={onSelectPost}
								onDeletePost={onDeletePost}
								onVote={onVote}
								userVoteValue={
									postStateValue.postVotes.find(
										(item) => item.postId === post.id
									)?.voteValue
								}
								userIsCreator={user?.uid === post.creatorId}
								homePage
							/>
						))}
					</Stack>
				)}
			</>
			<Stack spacing={5}>
				<Recommendations />
				<Premium />
				<PersonalHome />
			</Stack>
		</PageContent>
	);
};

export default Home;
