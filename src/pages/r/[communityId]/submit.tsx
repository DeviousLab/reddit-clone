import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import PageContent from '../../../components/layout/PageContext';
import NewPostForm from '../../../components/posts/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/client';
import { communityState } from '../../../atoms/communitiesAtom';

const SubmitPost:React.FC= () => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);
  console.log(communityStateValue);
  return (
    <PageContent maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user}/>}
      </>
      <></>
    </PageContent>
  );
}
export default SubmitPost;