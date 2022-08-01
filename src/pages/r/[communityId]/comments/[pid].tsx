import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

import About from '../../../../components/community/About';
import PostItem from '../../../../components/posts/PostItem';
import PostLoader from '../../../../components/posts/PostLoader';
import PageContent from '../../../../components/layout/PageContext';
import usePosts from '../../../../hooks/usePosts';
import { auth, firestore } from '../../../../firebase/client';
import { Post } from '../../../../atoms/postsAtom';
import useCommunityData from '../../../../hooks/useCommunityData';
import Comments from '../../../../components/posts/Comments/Comments';
import { User } from 'firebase/auth';

const PostPage: React.FC = ({}) => {
	const [user] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const { postStateValue, setPostStateValue, onDeletePost, onVote } =
		usePosts();
	const { communityStateValue } = useCommunityData();

	const router = useRouter();

	const fetchPost = async (postId: string) => {
		try {
			const postDocRef = doc(firestore, 'posts', postId);
			const postDoc = await getDoc(postDocRef);
			setPostStateValue((prev) => ({
				...prev,
				selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
			}));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const { pid } = router.query;
		if (pid && !postStateValue.selectedPost) {
			fetchPost(pid as string);
		}
	}, [router.query, postStateValue.selectedPost]);

	return (
		<PageContent>
			<>
				{loading ? (
					<PostLoader />
				) : (
					<>
						{postStateValue.selectedPost && (
							<>
								<PostItem
									post={postStateValue.selectedPost}
									onVote={onVote}
									onDeletePost={onDeletePost}
									userVoteValue={
										postStateValue.postVotes.find(
											(item) => item.postId === postStateValue.selectedPost!.id
										)?.voteValue
									}
									userIsCreator={
										user?.uid === postStateValue.selectedPost.creatorId
									}
								/>
							</>
						)}
						<Comments user={user as User} selectedPost={postStateValue.selectedPost} communityId={postStateValue.selectedPost?.communityId as string} />
					</>
				)}
			</>
			<>
				{communityStateValue.currentCommunity && (
					<About communityData={communityStateValue.currentCommunity} />
				)}
			</>
		</PageContent>
	);
};
export default PostPage;
