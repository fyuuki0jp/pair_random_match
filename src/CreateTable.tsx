import { useRecoilValue } from 'recoil';
import React, { useState } from 'react';
import { membersAtom,constructAtom, DayPairs, Pair, WorkPairs} from './State';
import { createWorkPairs,padPair } from './Logic';
import { faCalendar ,faUser} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function DayMember(props:{day:DayPairs}){
    const maxMember = props.day.pairs.reduce((acc:number,pair:Pair) => acc < pair.pair.length ? pair.pair.length:acc,0)
    const colTitle = new Array<string>()
    for(let i=0;i<maxMember;i++)
    {
        colTitle.push('メンバー'+(i+1))
    }
    return (
        <table border={1} style={{minWidth:'300px',maxWidth:'600px',width:'25%'}}>
            <tr>
            {colTitle.map(col => <th style={{width:'90px'}}>{col}</th>)}
            </tr>
            {props.day.pairs.map(pair => <tr>{padPair(pair,maxMember).pair.map(member => <td style={{width:'90px'}}>{member.name}</td>)}</tr>)}
        </table>
    )
}

function WorkCalender(){
    const construct = useRecoilValue(constructAtom)
    const members = useRecoilValue(membersAtom)
    const [generation,setGen] = useState(false)
    const [calender,setCalender] = useState<WorkPairs>()
    const generateCalender = () => {
        const error = construct.pairs[0].pair_cnt === construct.pairs[1].pair_cnt
        if(!error)
            if (!generation){
                setGen(true)
                createWorkPairs(construct,members).then(e => {setCalender(e);setGen(false)})
            }
        else
            alert('ペア人数が重複しています設定を見直してください。')
    }

    return (
        <div style={{minWidth:'300px',width:'70%'}}>
            <div style={
                generation ? {display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',border:'solid',borderRadius:'10px',color:'white',backgroundColor:'gray',userSelect:'none'}:{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',border:'solid',borderRadius:'10px',color:'white',backgroundColor:'#5490cc',userSelect:'none'}
            }
                    unselectable={'on'}
                     onClick={generateCalender}>
                <FontAwesomeIcon icon={faCalendar} size='xl' style={{marginLeft:'10px'}}/>
                <span style={{fontSize:'15pt',maxWidth:'100%',appearance:'none',outline:0,border:'none',fontWeight:'bolder'}}>ペア作成</span>
                <FontAwesomeIcon icon={faUser} size='xl' style={{marginLeft:'10px'}}/>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',width:'100%',minWidth:'300px',height:'90vh',overflowY:'auto'}}>
                {calender?.WorkPairs.map(day => <DayMember day={day}/>)}
            </div>
        </div>
    )
}

export default WorkCalender