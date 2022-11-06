import * as React from 'react';
import { monaco, ControlledEditor } from '@monaco-editor/react';
import { useRecoilState } from "recoil"
import { IFile } from "./data"
import { fileListState } from './atom';

interface IProps {
    fileNum: number
}

monaco
    .init()
    .then(monaco => {
        monaco.languages.register({ id: 'glsl', base: "c" });
        monaco.languages.setMonarchTokensProvider('glsl', {
            tokenizer: {
                root: [
                    [/vec[0-4]|mat[0-4]|float/, 'vector'],
                    [/\-?\d\.\d*|\d/, 'number'],
                    [/void/, 'function'],
                ],
            },
        });
        monaco.editor.defineTheme('vs-dark-custom', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'vector', foreground: '569cd6' },
                { token: 'number', foreground: 'ffe5c3' },
                { token: 'function', foreground: '569cd6' },
                { token: 'variable', foreground: 'ae81ff' },
            ],
        });
    })
    .catch((e) => console.error(e));

export const Editor: React.FC<IProps> = (props: IProps) => {
    const [fileList, setFileList] = useRecoilState<IFile[]>(fileListState);

    return <ControlledEditor
        language={fileList[props.fileNum].language}
        value={fileList[props.fileNum].script}
        onChange={(e, value) => {
            setFileList(fileList.map((e, i) => {
                return {
                    name: e.name,
                    language: e.language,
                    script: i == props.fileNum ? value : e.script,
                } as IFile
            }))
        }}
        options={fileList[props.fileNum].language == "html" ? { readOnly: true } : { readOnly: false }}
        theme='vs-dark-custom'
    />;
};
