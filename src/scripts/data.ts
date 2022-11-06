export interface IFile {
    name: string,
    language: string,
    script: string
}

export interface IData {
    title: string,
    mainPage: string,
    files: IFile[]
}

export const Data: IData[] = [
    {
        title: 'MengerSponge',
        mainPage: "index.html",
        files: [
            { name: "index.html", language: "html" } as IFile,
            { name: "main.js", language: "javascript" } as IFile,
            { name: "webgl2.js", language: "javascript" } as IFile,
            { name: "frag.glsl", language: "glsl" } as IFile,
            { name: "main.css", language: "css" } as IFile,
        ]
    },
    {
        title: 'ReactionDiffusion',
        mainPage: "index.html",
        files: [
            { name: "index.html", language: "html" } as IFile,
            { name: "main.js", language: "javascript" } as IFile,
            { name: "webgl2.js", language: "javascript" } as IFile,
            { name: "initialFrag.glsl", language: "glsl" } as IFile,
            { name: "mainFrag.glsl", language: "glsl" } as IFile,
            { name: "renderingFrag.glsl", language: "glsl" } as IFile,
            { name: "main.css", language: "css" } as IFile,
        ]
    }
];