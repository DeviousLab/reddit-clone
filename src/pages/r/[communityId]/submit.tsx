import React from 'react';
import { Box, Text } from '@chakra-ui/react';

import PageContent from '../../../components/layout/PageContext';
import NewPostForm from '../../../components/posts/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/client';
import useCommunityData from '../../../hooks/useCommunityData';
import About from '../../../components/community/About';
import Header from '../../../components/community/Header';

const SubmitPost:React.FC= () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();
  return (
  <>  
    <Header communityData={communityStateValue.currentCommunity!} />
    <PageContent maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL}/>}
      </>
      <>
        {communityStateValue.currentCommunity && (<About communityData={communityStateValue.currentCommunity} />)}
      </>
    </PageContent>
  </>
  );
}
export default SubmitPost;