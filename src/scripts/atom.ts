import { atom } from "recoil"
import { IFile } from "./data"
import { ViewMode } from "./view"

export const fileListState = atom<IFile[]>({
    key: "fileList",
    default: [],
})

export const contentOpenState = atom<boolean>({
    key: "contentOpen",
    default: false
})

export const contentReloadState = atom<boolean>({
    key: "contentReload",
    default: false
})

export const viewModeState = atom<ViewMode>({
    key: "viewMode",
    default: ViewMode.Full
})

export const viewModeSelectOpenState = atom<boolean>({
    key: "viewModeSelectOpen",
    default: false
})