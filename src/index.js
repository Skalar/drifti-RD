import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode='light'></ColorModeScript>
      <App />
    </ChakraProvider>

  // document.getElementById('root')
);

