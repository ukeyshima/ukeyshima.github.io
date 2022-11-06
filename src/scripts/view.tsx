import * as React from 'react';
import { ReactNode } from 'react';
import { useRecoilState } from "recoil"
import { Box, Button } from '@mui/material';
import { IFrameWrapper } from "./iframeWrapper"
import { EditorWrapper } from "./editorWrapper"
import { contentOpenState, viewModeState, viewModeSelectOpenState } from './atom';
import { BorderHorizontal, BorderVertical, BorderClear } from '@mui/icons-material';

interface IBackgroundProps {
    onClick: (e: React.MouseEvent) => void
}

interface IWrapperProps {
    children: ReactNode,
    viewMode: ViewMode
}

interface IViewModeIconProps {
    viewMode: ViewMode
}

interface IViewModeButtonProps {
    viewMode: ViewMode,
    left: number,
    top: number,
    backgroundColor: string,
    onClick: (e: React.MouseEvent) => void
}

interface IViewModeSelectProps {
    onClick: (viewMode: ViewMode) => void,
    viewMode: ViewMode
}

export enum ViewMode {
    Full = 0,
    Horizontal = 1,
    Vertical = 2,
}

const Background = (props: IBackgroundProps) => <Box
    sx={{
        width: 100 + "vw",
        height: 100 + "vh",
        backgroundColor: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(7px)",
        position: "fixed",
        top: 0,
        left: 0,
    }}
    onClick={props.onClick}
/>

const Wrapper = (props: IWrapperProps) => <Box
    sx={{
        position: "fixed",
        top: 50 + "%",
        left: 50 + "%",
        transform: "translate(-50%, -50%)",
        width: 80 + "vw",
        height: 80 + "vh",
        background: "#ffffff",
        display: "flex",
        flexFlow: props.viewMode == ViewMode.Vertical ? "column" : "row"
    }} >
    {props.children}
</Box>

const ViewModeButton = (props: IViewModeButtonProps) => <Button
    sx={{
        color: "black",
        position: "absolute",
        left: props.left,
        top: props.top,
        width: 60,
        height: 60,
        backgroundColor: props.backgroundColor,
        borderRadius: "50%",
    }}
    onClick={props.onClick}>
    <ViewModeIcon viewMode={props.viewMode} />
</Button>

const ViewModeIcon = (props: IViewModeIconProps) => {
    switch (props.viewMode) {
        case ViewMode.Full:
            return <BorderClear
                sx={{
                    width: 40,
                    height: 40,
                    position: "absolute",
                    top: 50 + "%",
                    left: 50 + "%",
                    transform: "translate(-50%, -50%)",
                }} />
        case ViewMode.Vertical:
            return <BorderHorizontal
                sx={{
                    width: 40,
                    height: 40,
                    position: "absolute",
                    top: 50 + "%",
                    left: 50 + "%",
                    transform: "translate(-50%, -50%)",
                }} />
        case ViewMode.Horizontal:
            return <BorderVertical
                sx={{
                    width: 40,
                    height: 40,
                    position: "absolute",
                    top: 50 + "%",
                    left: 50 + "%",
                    transform: "translate(-50%, -50%)",
                }} />
    }
}

const ViewModeSelect = (props: IViewModeSelectProps) => <React.Fragment>
    <ViewModeButton
        viewMode={ViewMode.Full}
        left={100}
        top={10}
        backgroundColor={props.viewMode == ViewMode.Full ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)"}
        onClick={() => props.onClick(ViewMode.Full)}
    />
    <ViewModeButton
        viewMode={ViewMode.Horizontal}
        left={85}
        top={85}
        backgroundColor={props.viewMode == ViewMode.Horizontal ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)"}
        onClick={() => props.onClick(ViewMode.Horizontal)}
    />
    <ViewModeButton
        viewMode={ViewMode.Vertical}
        left={10}
        top={100}
        backgroundColor={props.viewMode == ViewMode.Vertical ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)"}
        onClick={() => props.onClick(ViewMode.Vertical)}
    />
</React.Fragment>

export const View: React.FC = () => {
    const [contentOpen, setContentOpen] = useRecoilState(contentOpenState);
    const [viewMode, SetViewMode] = useRecoilState(viewModeState);
    const [viewModeSelectOpen, SetViewModeSelectOpen] = useRecoilState(viewModeSelectOpenState);

    return (
        <React.Fragment>
            <Background onClick={e => { e.target == e.currentTarget && setContentOpen(false); }} />
            <Wrapper viewMode={viewMode}>
                <ViewModeButton
                    viewMode={viewMode}
                    left={20}
                    top={20}
                    backgroundColor={"rgba(255,255,255,0.4)"}
                    onClick={() => { SetViewModeSelectOpen(!viewModeSelectOpen) }}
                />
                {viewModeSelectOpen && <ViewModeSelect
                    onClick={viewMode => {
                        SetViewMode(viewMode);
                        SetViewModeSelectOpen(false);
                    }}
                    viewMode={viewMode}
                />}
                <IFrameWrapper
                    width={viewMode == ViewMode.Horizontal ? 50 : 100}
                    height={viewMode == ViewMode.Vertical ? 50 : 100}
                />
                {viewMode != ViewMode.Full && <EditorWrapper
                    width={viewMode == ViewMode.Horizontal ? 50 : 100}
                    height={viewMode == ViewMode.Horizontal ? 100 : 50}
                />}
            </Wrapper>
        </React.Fragment >
    );
}