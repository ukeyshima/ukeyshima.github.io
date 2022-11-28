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
    },
    {
        title: 'Boids',
        mainPage: "index.html",
        files: [
            { name: "index.html", language: "html" } as IFile,
            { name: "main.js", language: "javascript" } as IFile,
            { name: "initParams.js", language: "javascript" } as IFile,
            { name: "index.js", language: "javascript" } as IFile,
            { name: "bitonicSort.js", language: "javascript" } as IFile,
            { name: "gridIndex.js", language: "javascript" } as IFile,
            { name: "updateParams.js", language: "javascript" } as IFile,
            { name: "boids.js", language: "javascript" } as IFile,
            { name: "rendering.js", language: "javascript" } as IFile,
            { name: "matrix4x4.js", language: "javascript" } as IFile,
            { name: "webgl2.js", language: "javascript" } as IFile,
            { name: "model.js", language: "javascript" } as IFile,
            { name: "initParamsFrag.glsl", language: "glsl" } as IFile,
            { name: "indexFrag.glsl", language: "glsl" } as IFile,
            { name: "bitonicSortFrag.glsl", language: "glsl" } as IFile,
            { name: "gridIndexFrag.glsl", language: "glsl" } as IFile,
            { name: "updateParamsFrag.glsl", language: "glsl" } as IFile,
            { name: "boidsFrag.glsl", language: "glsl" } as IFile,
            { name: "boidsVert.glsl", language: "glsl" } as IFile,
            { name: "renderingFrag.glsl", language: "glsl" } as IFile,
            { name: "main.css", language: "css" } as IFile,
        ]
    }
];