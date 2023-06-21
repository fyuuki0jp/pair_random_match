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
export interface PairProfile { 
    idx:number,
    pair_cnt:number,
}
export interface Construct {
    pairs:PairProfile[]
}
// pairs 
export interface ConstructResult {
    [key:string]:number
}

const membersAtom = atom<Member[]>([{idx:0,name:'name',level:0}])
const constructAtom = atom<Construct>({pairs:[{idx:0,pair_cnt:2},{idx:1,pair_cnt:3}]})

export {membersAtom,constructAtom}