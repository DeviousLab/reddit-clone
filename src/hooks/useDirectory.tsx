import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';

import { communityState } from '../atoms/communitiesAtom';
import {
	DirectoryMenuItem,
	directoryMenuState,
} from '../atoms/directoryMenuAtom';
import { FaReddit } from 'react-icons/fa';

const useDirectory = () => {
	const [directoryState, setDirectoryState] =
		useRecoilState(directoryMenuState);
	const communityStateValue = useRecoilValue(communityState);
	const router = useRouter();

	const toggleDirectory = () => {
		setDirectoryState((prev) => ({
			...prev,
			open: !directoryState.open,
		}));
	};

	const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
		setDirectoryState((prev) => ({
			...prev,
			selectedMenuItem: menuItem,
			open: false,
		}));
		router.push(menuItem.link);
	};

	useEffect(() => {
		const { currentCommunity } = communityStateValue;
		if (currentCommunity) {
			setDirectoryState((prev) => ({
				...prev,
				selectedMenuItem: {
					displayText: `r/${currentCommunity.id}`,
					link: `/r/${currentCommunity.id}`,
					icon: FaReddit,
					iconColor: 'blue.500',
					imageURL: currentCommunity.imageURL,
				},
			}));
		}
	}, []);

	return {
		directoryState,
		toggleDirectory,
		onSelectMenuItem,
	};
};
export default useDirectory;
