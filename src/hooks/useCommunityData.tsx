import {
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import {
	Community,
	CommunitySnippet,
	communityState,
} from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/client';
import { authModalState } from '../atoms/authModalAtom';

const useCommunityData = () => {
	const [communityStateValue, setCommunityStateValue] =
		useRecoilState(communityState);
	const setAuthModalState = useSetRecoilState(authModalState);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [user] = useAuthState(auth);

	const router = useRouter();

	const onJoinOrLeaveCommunity = (
		communityData: Community,
		isJoined: boolean
	) => {
		if (!user) {
			setAuthModalState({ open: true, variant: 'signin' });
			return;
		}
		setLoading(true);
		if (isJoined) {
			leaveCommunity(communityData.id);
			return;
		}
		joinCommunity(communityData);
	};

	const joinCommunity = async (communityData: Community) => {
		try {
			const batch = writeBatch(firestore);
			const newSnippet: CommunitySnippet = {
				communityId: communityData.id,
				imageURL: communityData.imageURL || '',
				isModerator: user?.uid === communityData.creatorId,
			};
			batch.set(
				doc(
					firestore,
					`users/${user?.uid}/communitySnippets`,
					communityData.id
				),
				newSnippet
			);
			batch.update(doc(firestore, 'communities', communityData.id), {
				numberOfReaders: increment(1),
			});
			await batch.commit();
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: [...prev.mySnippets, newSnippet],
			}));
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		}
		setLoading(false);
	};

	const leaveCommunity = async (communityId: string) => {
		try {
			const batch = writeBatch(firestore);
			batch.delete(
				doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
			);
			batch.update(doc(firestore, 'communities', communityId), {
				numberOfReaders: increment(-1),
			});
			await batch.commit();
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: prev.mySnippets.filter(
					(item) => item.communityId !== communityId
				),
			}));
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		}
		setLoading(false);
	};

	const getMySnippets = async () => {
		setLoading(true);
		try {
			const snippetDocs = await getDocs(
				collection(firestore, `users/${user?.uid}/communitySnippets`)
			);
			const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: snippets as CommunitySnippet[],
				snippetsFetched: true,
			}));
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		}
		setLoading(false);
	};

	const getCommunityData = async (communityId: string) => {
		try {
			const communityDocRef = doc(firestore, 'communities', communityId);
			const communityDoc = await getDoc(communityDocRef);
			setCommunityStateValue((prev) => ({
				...prev,
				currentCommunity: {
					id: communityDoc.id,
					...communityDoc.data(),
				} as Community,
			}));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!user) {
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: [],
				snippetsFetched: false,
			}));
		}
		getMySnippets();
	}, [user]);

	useEffect(() => {
		const { communityId } = router.query;
		if (communityId && !communityStateValue.currentCommunity) {
			getCommunityData(communityId as string);
		}
	}, [router.query, communityStateValue.currentCommunity]);

	return {
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	};
};
export default useCommunityData;
