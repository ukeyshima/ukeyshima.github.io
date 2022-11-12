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
    },
    {
        title: 'SmokeSimulation',
        mainPage: "index.html",
        files: [
            { name: "index.html", language: "html" } as IFile,
            { name: "main.js", language: "javascript" } as IFile,
            { name: "advection.js", language: "javascript" } as IFile,
            { name: "buoyancy.js", language: "javascript" } as IFile,
            { name: "impulse.js", language: "javascript" } as IFile,
            { name: "divergence.js", language: "javascript" } as IFile,
            { name: "jacobi.js", language: "javascript" } as IFile,
            { name: "subtractGradient.js", language: "javascript" } as IFile,
            { name: "rendering.js", language: "javascript" } as IFile,
            { name: "webgl2.js", language: "javascript" } as IFile,
            { name: "advectionFrag.glsl", language: "glsl" } as IFile,
            { name: "buoyancyFrag.glsl", language: "glsl" } as IFile,
            { name: "impulseFrag.glsl", language: "glsl" } as IFile,
            { name: "divergenceFrag.glsl", language: "glsl" } as IFile,
            { name: "jacobiFrag.glsl", language: "glsl" } as IFile,
            { name: "subtractGradientFrag.glsl", language: "glsl" } as IFile,
            { name: "renderingFrag.glsl", language: "glsl" } as IFile,
            { name: "main.css", language: "css" } as IFile,
        ]
    }
];