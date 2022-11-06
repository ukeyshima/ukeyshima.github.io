import * as React from 'react';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil"
import { fileListState, contentReloadState } from './atom';
import { IFile } from "./data"

interface IProps {
    width: number,
    height: number
}

const GetScriptDocument = (props: IFile[]) => {
    const html = props.find(e => e.language == "html");
    let script: string = html?.script ?? "";
    props.forEach(e => {
        switch (e.language) {
            case "css":
                script = script.replace(`<link href="./${e.name}" rel="stylesheet" />`, `<style>${e.script}</style>`);
                break;
            case "javascript":
                script = script.replace(`<script src="./${e.name}" type="text/javascript"></script>`, `<script>${e.script}</script>`);
                break;
            case "glsl":
                script = script.replace(`<script src="./${e.name}" type="text/plain" id="${e.name.split(".")[0]}"></script>`, `<script type="text/plain" id="${e.name.split(".")[0]}">${e.script}</script>`);
                break;
            default:
                break;
        }
    });
    return script;
};

export const IFrameWrapper: React.FC<IProps> = (props: IProps) => {
    const [fileList, setFileList] = useRecoilState<IFile[]>(fileListState);
    const [contentReload, setContentReload] = useRecoilState<boolean>(contentReloadState);
    const [srcDoc, setSrcDoc] = useState("");

    useEffect(() => {
        setSrcDoc(GetScriptDocument(fileList));
    }, [contentReload]);

    return <iframe srcDoc={srcDoc} style={{ width: props.width + "%", height: props.height + "%", borderWidth: 0 }} />;
};