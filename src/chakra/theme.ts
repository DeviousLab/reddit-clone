import { extendTheme } from '@chakra-ui/react';
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';

const colors = {
	brand: {
		100: '#FF3C00',
	},
};

const fonts = {
	body: 'Open Sans, sans-serif',
};

const styles = {
	global: () => ({
		body: {
			bg: 'gray.200',
		},
	}),
};

const components = {
  
}

export const theme = extendTheme({ colors, fonts, styles });
