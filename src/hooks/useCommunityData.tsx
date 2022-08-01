import {
	collection,
	doc,
	getDocs,
	increment,
	writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';

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
			}));
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (!user) {
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: [],
			}));
		};
		getMySnippets();
	}, [user]);

	return {
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	};
};
export default useCommunityData;
