import React from 'react';
import { AppProps } from 'next/app';

import 'suneditor/dist/css/suneditor.min.css';

import { ThemeContextProvider} from '../contexts/ThemeContext';
import GlobalStyles from '../styles/GlobalStyles';

export default function MyApp({ Component, pageProps }: AppProps){

    return (
        <ThemeContextProvider>

            <GlobalStyles />

            <Component {...pageProps} />    

        </ThemeContextProvider>
    );
}
