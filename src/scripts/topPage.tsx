import * as React from 'react';
import { ReactNode } from 'react';
import { useRecoilState } from "recoil"
import { Box, Typography, Container, Fade } from '@mui/material';
import { ImageMatrix } from './imageMatrix';
import { contentOpenState } from './atom';
import { View } from "./view"

interface IHeaderProps {
    children: ReactNode
}

const Header = (props: IHeaderProps) => <Box sx={{
    display: "table-cell",
    width: 100 + "vw",
    height: 100 + "vh",
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'light',
    fontFamily: 'Monospace',
    letterSpacing: 4
}}>{props.children}</Box>

export const TopPage: React.FC = () => {
    const [contentOpen, setContentOpen] = useRecoilState(contentOpenState);

    return (
        <Box>
            <Header>
                <Typography sx={{ padding: 2 }} variant="h5">WebGraphics</Typography>
                <Typography>Real-time simulation and art implemented on WebGL</Typography>
            </Header>
            <Container maxWidth="lg" >
                <ImageMatrix />
                {contentOpen && <View />}
            </Container>
        </Box>
    );
}