import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from "recoil"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TopPage } from "./scripts/topPage";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App: React.FC = () => <RecoilRoot>
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <TopPage />
    </ThemeProvider>
</RecoilRoot >

const container: HTMLElement = document.querySelector('#app') as HTMLElement;
const root = createRoot(container);

root.render(<App />);