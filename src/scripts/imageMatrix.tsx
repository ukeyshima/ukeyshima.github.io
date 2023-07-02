import * as React from 'react';
import { useRecoilState } from "recoil"
import { ImageList, ImageListItem, Box } from '@mui/material';
import { Data, IData, IFile } from "./data"
import { fileListState, contentOpenState } from './atom';

const size: number = 200;
const columnNum: number = 4;
const gap: number = 5;

interface IImageProps {
    name: string,
    type: string,
    size: number,
    onClick: (e: React.MouseEvent) => void
}

const Image = (props: IImageProps) => <img
    style={{ width: props.size, height: props.size, objectFit: "cover" }}
    src={`./assets/img/thumbnails/${props.type}/${props.name}.png`}
    alt={props.name}
    loading="lazy"
    onClick={props.onClick}
/>

const GetFileList = async (data: IData) => {
    const fileList: IFile[] = await Promise.all(data.files.map(async e => {
        return {
            name: e.name,
            language: e.language,
            script: await fetch(`assets/contents/${data.type}/${data.title}/${e.name}`).then((result) => result.text()),
        } as IFile
    }));
    return fileList;
}

export const ImageMatrix: React.FC = () => {
    const [fileList, setFileList] = useRecoilState<IFile[]>(fileListState);
    const [contentOpen, setContentOpen] = useRecoilState(contentOpenState);

    return (
        <Box onClick={e => { if (e.target == e.currentTarget) setContentOpen(false) }}>
            <ImageList sx={{ width: size * columnNum + gap * (columnNum), margin: "auto" }} cols={columnNum} gap={gap} variant={'standard'}>
                {Data.map(data => (
                    <ImageListItem key={data.title}>
                        <Image
                            name={data.title}
                            type={data.type}
                            size={size}
                            onClick={async () => {
                                setFileList(await GetFileList(data));
                                setContentOpen(true);
                            }}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}