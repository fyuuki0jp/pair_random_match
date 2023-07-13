import { useRecoilState,useRecoilValue } from 'recoil';
import React, { useRef, useState } from 'react';
import {membersAtom , constructAtom, ConstructResult} from './State';
import { combination, searchPairPattern } from './Logic';


const ConstructPairSetting = ()=>{
    const [construct,setConstruct] = useRecoilState(constructAtom)
    const [pair,setPair] = useState(construct.pairs)
    const [edit,setEdit] = useState(false)
    return (
        <ul>
        {pair.map(p => <li>{p.idx},{p.pair_cnt}</li>)}
        </ul>
    )
}

function ConstructSetting(){
    const members = useRecoilValue(membersAtom)
    const construct = useRecoilValue(constructAtom)

//    const pairs:ConstructResult = members.length > 0 ? searchPairPattern(construct,members.length):{}

    return <div style={{'minWidth':'300px',maxWidth:'480px',width:'40vw',padding:'0.5rem'}}>
        <ConstructPairSetting />
    </div>
}

export default ConstructSetting