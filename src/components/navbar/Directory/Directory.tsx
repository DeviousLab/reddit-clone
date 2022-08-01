import React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Box,
	Flex,
	Icon,
	Image,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react';
import { TiHome } from 'react-icons/ti';

import Communities from './Communities';
import useDirectory from '../../../hooks/useDirectory';

const Directory: React.FC = () => {
	const { directoryState, toggleDirectory } = useDirectory();
	return (
		<Menu isOpen={directoryState.open}>
			<MenuButton
				cursor='pointer'
				padding='0px 6px'
				borderRadius='4px'
				mr={2}
				ml={{ base: 0, md: 2 }}
				_hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
				onClick={toggleDirectory}
			>
				<Flex
					align='center'
					justify='space-between'
					width={{ base: 'auto', lg: '200px' }}
				>
					<Flex align='center'>
					{directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                borderRadius="full"
                boxSize="24px"
                mr={2}
              />
            ) : (
              <Icon
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                as={directoryState.selectedMenuItem.icon}
                color={directoryState.selectedMenuItem.iconColor}
              />
            )}
						<Flex display={{ base: 'none', lg: 'flex' }}>
							<Text fontWeight={600} fontSize='10pt'>
								{directoryState.selectedMenuItem.displayText}
							</Text>
						</Flex>
					</Flex>
					<ChevronDownIcon />
				</Flex>
			</MenuButton>
			<MenuList>
				<Communities />
			</MenuList>
		</Menu>
	);
};
export default Directory;
