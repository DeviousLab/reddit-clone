import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

type TextInputsProps = {
	textInputs: {
		title: string;
		body: string;
	};
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleCreatePost: () => void;
	loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
	textInputs,
	onChange,
	handleCreatePost,
	loading,
}) => {
	return (
		<Stack spacing={3} width='100%'>
			<Input
				name='title'
				_placeholder={{ color: 'gray.500' }}
				_focus={{
					outline: 'none',
					bg: 'white',
					border: '1px solid',
					borderColor: 'black',
				}}
				fontSize='10pt'
				borderRadius={4}
				placeholder='Title'
				onChange={onChange}
				value={textInputs.title}
			/>
			<Textarea
				name='body'
				fontSize='10pt'
				placeholder='Text (optional)'
				_placeholder={{ color: 'gray.500' }}
				_focus={{
					outline: 'none',
					bg: 'white',
					border: '1px solid',
					borderColor: 'black',
				}}
				height='100px'
				onChange={onChange}
				value={textInputs.body}
			/>
			<Flex justify='flex-end'>
				<Button
					height='34px'
					padding='0px 30px'
					disabled={!textInputs.title}
					isLoading={loading}
					onClick={handleCreatePost}
				>
					Post
				</Button>
			</Flex>
		</Stack>
	);
};
export default TextInputs;
