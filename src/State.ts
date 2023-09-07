import { atom, selector } from "recoil"

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

// monthPairsの要素のインターフェース
export interface DayPairs {
    pairs: Pair[]; // ペアの配列
}

// monthPairsの型のインターフェース
export interface WorkPairs {
    WorkPairs: DayPairs[]; // 月のペアの組み合わせの配列
}

//Save how many pairs
export interface PairProfile { 
    idx:number,
    pair_cnt:number, //member per pair
}
// pair construct info
export interface Construct {
    pairs:PairProfile[] //pair kind
    work_day:number
    n_trials:number
}
// pairs info
export interface ConstructResult {
    [key:string]:number //pair count
}


const membersAtom = atom<Member[]>({key:'memberState',default:[{idx:0,name:'名前0',level:0}]})

const constructAtom = atom<Construct>({key:'pairConstruct',default:{pairs:[{idx:0,pair_cnt:2},{idx:1,pair_cnt:3}],work_day:30,n_trials:100}})

export {membersAtom,constructAtom}