import React from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';

const HorizonWrapper = ({ children }) => {
    return (
        <ChakraProvider theme={theme}>
            <ThemeEditorProvider>
                {children}
            </ThemeEditorProvider>
        </ChakraProvider>
    )
}

export default HorizonWrapper