import { useAtom,useAtomValue } from 'jotai';
import React, { useRef, useState } from 'react';
import {membersAtom , constructAtom, ConstructResult} from './State';
import { combination, searchPairPattern } from './Logic';

function ConstructSetting(){
    const members = useAtomValue(membersAtom)
    const [construct,setConstruct] = useAtom(constructAtom)

    const pairs:ConstructResult = searchPairPattern(construct,members.length)

    return <div>{JSON.stringify(pairs)}</div>
}

export default ConstructSetting