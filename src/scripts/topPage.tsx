import * as React from 'react';
import { ReactNode } from 'react';
import { useRecoilState } from "recoil"
import { Box, Typography, Container, Breadcrumbs, Link } from '@mui/material';
import { ImageMatrix } from './imageMatrix';
import { contentOpenState } from './atom';
import { pageTypeState } from './atom';
import { PageType } from "./data"
import { View } from "./view"

interface IHeaderProps {
    children: ReactNode
}

const Header = (props: IHeaderProps) => <Box sx={{
    display: "table-cell",
    width: 100 + "vw",
    height: 30 + "vh",
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'light',
    fontFamily: 'Monospace',
    letterSpacing: 4
}}>{props.children}</Box>

export const TopPage: React.FC = () => {
    const [contentOpen, setContentOpen] = useRecoilState(contentOpenState);
    const [pageType, setPageType] = useRecoilState<PageType>(pageTypeState);

    return (
        <Box>
            <Header>
                <Typography sx={{ padding: 2 }} variant="h5">ukeyshima.github.io</Typography>
                <Breadcrumbs sx={{ "& ol": { justifyContent: "center", margin: "auto" } }}>
                    <Link onClick={() => setPageType(PageType.WebGL)}>WebGL</Link>
                    <Link onClick={() => setPageType(PageType.WebGPU)}>WebGPU</Link>
                </Breadcrumbs>
            </Header>
            <Container maxWidth="lg" >
                <ImageMatrix pageType={pageType} />
                {contentOpen && <View />}
            </Container>
        </Box>
    );
}