import {atom} from 'jotai'

// member param
export interface Member {
    idx:number,
    name:string,
    level:number
}
// pair list
export interface Pair {
    idx:number,
    pair:Member[]
}
export interface Construct {
    pairs:number[]
}
// pairs 
export interface ConstructResult {
    [key:string]:number
}

const membersAtom = atom<Member[]>([{idx:0,name:'name',level:0}])
const constructAtom = atom<Construct>({pairs:[2,3]})

export {membersAtom,constructAtom}