import { useRecoilValue } from 'recoil';
import React, { useState } from 'react';
import { membersAtom,constructAtom, DayPairs, Pair, WorkPairs} from './State';
import { createWorkPairs,padPair } from './Logic';
import { faCalendar ,faUser ,faDownload} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconv from "iconv-lite";

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
                setTimeout(()=>{createWorkPairs(construct,members).then(e => {setCalender(e);setGen(false)})},1)
            }
        else
            alert('ペア人数が重複しています設定を見直してください。')
    }

    const createCSVoutput = () => {

        if(calender===undefined) return;

        let day_num = 1
        const output_data: string = calender.WorkPairs.map((day:DayPairs) => (day_num++)+'日目\n'+day.pairs.map((pair:Pair) => pair.pair.map(member=> member.name).join(',')).join('\n')).join('\n')
        const result = iconv.encode(output_data,"Shift_JIS")
        const blob = new Blob([result],{type:"text/csv"});
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);

        link.download = 'pair_list.csv';

        link.click();
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
                {!generation && calender?.WorkPairs.map(day => <DayMember day={day}/>)}
                {generation && <h3>ペア作成中...</h3>}
            </div>
            <div style={
                generation ? {display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',border:'solid',borderRadius:'10px',color:'white',backgroundColor:'gray',userSelect:'none'}:{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',border:'solid',borderRadius:'10px',color:'white',backgroundColor:'#5490cc',userSelect:'none'}
            }
                    unselectable={'on'}
                     onClick={createCSVoutput}>
                <FontAwesomeIcon icon={faCalendar} size='xl' style={{marginLeft:'10px'}}/>
                <span style={{fontSize:'15pt',maxWidth:'100%',appearance:'none',outline:0,border:'none',fontWeight:'bolder'}}>CSV出力</span>
                <FontAwesomeIcon icon={faDownload} size='xl' style={{marginLeft:'10px'}}/>
            </div>
        </div>
    )
}

export default WorkCalender