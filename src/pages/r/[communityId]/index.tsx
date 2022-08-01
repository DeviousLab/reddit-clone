import React, { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import safeJsonStringify from 'safe-json-stringify';
import { useSetRecoilState } from 'recoil';

import { firestore } from '../../../firebase/client';
import { Community, communityState } from '../../../atoms/communitiesAtom';
import NotFound from '../../../components/community/NotFound';
import Header from '../../../components/community/Header';
import PageContent from '../../../components/layout/PageContext';
import CreatePostLink from '../../../components/community/CreatePostLink';
import Posts from '../../../components/posts/Posts';
import About from '../../../components/community/About';

type CommunityPageProps = {
	communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	const setCommunityStateValue = useSetRecoilState(communityState);

	useEffect(() => {
		setCommunityStateValue((prev) => ({
			...prev,
			currentCommunity: communityData,
		}));
	}, [communityData]);
	
	if (!communityData) return (<NotFound />)
	
	return (
		<>
			<Header communityData={communityData} />
			<PageContent>
				<>
					<CreatePostLink />
					<Posts communityData={communityData} />
				</>
				<>
					<About communityData={communityData} />
				</>
			</PageContent>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	try {
		const communityDocRef = doc(
			firestore,
			'communities',
			context.query.communityId as string
		);
		const communityDoc = await getDoc(communityDocRef);
		return {
			props: {
				communityData: communityDoc.exists()
					? JSON.parse(
							safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
						)
					: '',
			},
		};
	} catch (error) {
		console.log(error);
	}
}

export default CommunityPage;
