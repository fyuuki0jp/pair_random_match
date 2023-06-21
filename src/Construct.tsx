import { useAtom,useAtomValue } from 'jotai';
import React, { useRef, useState } from 'react';
import {membersAtom , constructAtom, ConstructResult} from './State';
import { combination, searchPairPattern } from './Logic';


const ConstructPairSetting = ()=>{
    const [construct,setConstruct] = useAtom(constructAtom)
    const [pair,setPair] = useState(construct.pairs)
    const [edit,setEdit] = useState(false)
    return (
        <ul>
        {pair.map(p => <li>{p.idx},{p.pair_cnt}</li>)}
        </ul>
    )
}

function ConstructSetting(){
    const members = useAtomValue(membersAtom)
    const construct = useAtomValue(constructAtom)

    const pairs:ConstructResult = members.length > 0 ? searchPairPattern(construct,members.length):{}

    return <div style={{'minWidth':'300px',maxWidth:'480px',width:'40vw',padding:'0.5rem'}}>
        <ConstructPairSetting />
        {JSON.stringify(pairs)}
    </div>
}

export default ConstructSetting