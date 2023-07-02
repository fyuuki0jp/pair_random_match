import {atom} from 'jotai'

// member param
export interface Member {
    idx:number,
    name:string,
    level:number
}
// pair combination
export interface Pair {
    idx:number,
    pair:Member[]
}
//Save how many pairs
export interface PairProfile { 
    idx:number,
    pair_cnt:number, //member per pair
}
// pair construct info
export interface Construct {
    pairs:PairProfile[] //pair kind
}
// pairs info
export interface ConstructResult {
    [key:string]:number //pair count
}

const membersAtom = atom<Member[]>([{idx:0,name:'name',level:0}])
const constructAtom = atom<Construct>({pairs:[{idx:0,pair_cnt:2},{idx:1,pair_cnt:3}]})

export {membersAtom,constructAtom}