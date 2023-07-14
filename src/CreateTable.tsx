import { useRecoilValue } from 'recoil';
import React, { useEffect, useRef, useState } from 'react';
import {Member, membersAtom,constructAtom} from './State';
import { createWorkPairs } from './Logic';
function WorkCalender(){
    const construct = useRecoilValue(constructAtom)
    const members = useRecoilValue(membersAtom)

    const generateCalender = () => {
        createWorkPairs(construct,members).then(console.log)
    }

    return (
        <div>
            <button onClick={generateCalender}>ペア表作成</button>
        </div>
    )
}

export default WorkCalender