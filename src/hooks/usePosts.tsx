import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useRecoilState } from 'recoil';

import { Post, postState } from '../atoms/postsAtom';
import { firestore, storage } from '../firebase/client';

const usePosts = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);

	const onVote = async () => {};

	const onSelectPost = () => {};

	const onDeletePost = async (post: Post): Promise<boolean> => {
		try {
			if (post.imageURL) {
				const imageRef = ref(storage, `posts/${post.id}/image`);
				await deleteObject(imageRef);
			}
			const postDocRef = doc(firestore, 'posts', post.id!);
			await deleteDoc(postDocRef);
			setPostStateValue((prev) => ({
				...prev,
				posts: prev.posts.filter((item) => item.id !== post.id),
			}));
			return true;
		} catch (error: any) {
			return false;
		}
	};

	return {
		postStateValue,
		setPostStateValue,
		onVote,
		onDeletePost,
		onSelectPost,
	};
};
export default usePosts;
