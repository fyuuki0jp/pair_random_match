import { useRecoilState,useRecoilValue } from 'recoil';
import React, { useRef, useState } from 'react';
import {membersAtom , constructAtom, ConstructResult, PairProfile, Pair, Construct} from './State';
import { combination, searchPairPattern } from './Logic';

function PairConstruct(props:{pair:PairProfile,match_pairs:number,updatefunc:(newPair:PairProfile)=>void}){
    const [edit,setEdit] = useState(false)
    const pairs = [2,3,4,5]
    
    const updatePair = (new_cnt:string) => {
        const cnt:number = parseInt(new_cnt)
        const new_pair:PairProfile = {idx:props.pair.idx,pair_cnt:cnt}
        props.updatefunc(new_pair)
    }

    return (
        <li>
            <select onChange={e => {updatePair(e.target.value)}}>
                {pairs.map(cnt => <option value={cnt} selected={cnt==props.pair.pair_cnt}>{cnt}人ペア</option>)}
            </select>
        </li>
    )
}

const ConstructPairSetting = ()=>{
    const [construct,setConstruct] = useRecoilState(constructAtom)
    const [pair,setPair] = useState(construct.pairs)
    const [edit,setEdit] = useState(false)
    const members = useRecoilValue(membersAtom)

    const updatePair = (newPair:PairProfile) => {
        let newConstruct:Construct = JSON.parse(JSON.stringify(construct))
        newConstruct.pairs = newConstruct.pairs.map((item:PairProfile) => {
            return item.idx === newPair.idx ? newPair:item;
        }).sort((a,b) => a.idx-b.idx);
        setConstruct(newConstruct)
    }

    return (
        <ul>
        {pair.map(p => <PairConstruct pair={p} match_pairs={combination(members,p.pair_cnt).length} updatefunc={updatePair}/>)}
        </ul>
    )
}

function ConstructSetting(){
    const construct = useRecoilValue(constructAtom)

//    const pairs:ConstructResult = members.length > 0 ? searchPairPattern(construct,members.length):{}

    return <div style={{'minWidth':'300px',maxWidth:'480px',width:'40vw',padding:'0.5rem'}}>
        <ConstructPairSetting />
    </div>
}

export default ConstructSetting