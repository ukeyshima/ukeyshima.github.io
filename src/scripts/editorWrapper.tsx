import * as React from 'react';
import { useState, ReactNode } from 'react';
import { useRecoilState } from "recoil"
import { Box, Button } from '@mui/material';
import { Editor } from "./editor"
import { IFile } from "./data"
import { fileListState, contentReloadState } from './atom';

interface IProps {
    width: number,
    height: number
}

interface ITabProps {
    isActive: boolean,
    onClick: () => void,
    name: string
}

interface ITabWrapperProps {
    children: ReactNode
}

interface IRunButtonProps {
    onClick: () => void
}

const Tab = (props: ITabProps) => <Box
    onClick={props.onClick}
    sx={{
        backgroundColor: props.isActive ? 'rgb(20,20,20)' : 'rgb(40,40,40)',
        color: props.isActive ? 'rgb(255,255,255)' : 'rgb(120,120,120)',
        padding: '2px 20px',
        border: 'none',
        borderRight: '1px solid rgb(20,20,20)',
    }}>
    {props.name}
</Box>

const RunButton = (props: IRunButtonProps) => <Button sx={{
    borderRadius: 0,
    padding: "1px 15px",
    height: '29px',
    backgroundColor: 'rgb(20,20,20)',
    color: 'rgb(255,255,255)',
    border: 'none',
}}
    onClick={props.onClick}>
    ▷
</Button>

const TabWrapper = (props: ITabWrapperProps) => <Box sx={{
    backgroundColor: 'rgb(33,33,33)',
    height: '29px',
    display: 'flex',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
        display: "none"
    },
}} >
    {props.children}
</Box>

export const EditorWrapper: React.FC<IProps> = (props: IProps) => {
    const [fileList, setFileList] = useRecoilState<IFile[]>(fileListState);
    const [contentReload, setContentReload] = useRecoilState<boolean>(contentReloadState);
    const [activeNum, setActiveNum] = useState(0);

    return (
        <Box sx={{ width: props.width + "%", height: props.height + "%" }}>
            <TabWrapper>
                <RunButton onClick={() => setContentReload(!contentReload)} />
                {fileList.map((e, i) => <Tab
                    key={i}
                    isActive={i == activeNum}
                    onClick={() => setActiveNum(i)}
                    name={e.name}
                />)}
            </TabWrapper>
            <Box sx={{ height: `calc(100% - 29px)` }}>
                <Editor fileNum={activeNum} />
            </Box>
        </Box>
    );
};