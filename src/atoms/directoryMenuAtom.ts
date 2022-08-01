import { IconType } from 'react-icons';
import { TiHome } from 'react-icons/ti';
import { atom } from 'recoil';

export type DirectoryMenuItem = {
	displayText: string;
	link: string;
	icon: IconType;
	iconColor: string;
	imageURL?: string;
};

interface DirectoryMenuState {
	open: boolean;
	selectedMenuItem: DirectoryMenuItem;
}

export const defaultDirectoryMenuItem: DirectoryMenuItem = {
	displayText: 'Home',
	link: '/',
	icon: TiHome,
	iconColor: '#000',
};

export const defaultDirectoryMenuState: DirectoryMenuState = {
	open: false,
	selectedMenuItem: defaultDirectoryMenuItem,
};

export const directoryMenuState = atom<DirectoryMenuState>({
	key: 'directoryMenuState',
	default: defaultDirectoryMenuState,
});
