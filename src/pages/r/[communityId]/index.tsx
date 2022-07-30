import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import safeJsonStringify from 'safe-json-stringify';

import { firestore } from '../../../firebase/client';
import { Community } from '../../../atoms/communitiesAtom';
import NotFound from '../../../components/community/NotFound';
import Header from '../../../components/community/Header';
import PageContent from '../../../components/layout/PageContext';

type CommunityPageProps = {
	communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	if (!communityData) return <NotFound />;

	return (
		<>
			<Header communityData={communityData} />
			<PageContent>
				<>
					<div>left side</div>
				</>
				<>
					<div>right side</div>
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
