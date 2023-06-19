import {atom} from 'jotai'


export interface member_if {
    idx:number,
    name:string,
    level:number
}

export interface pair_if {
    idx:number,
    pair:member_if[]
}

export interface search_if {
    [key:string]:number
}

const membersAtom = atom<member_if[]>([{idx:0,name:'name',level:0}])


export {membersAtom}