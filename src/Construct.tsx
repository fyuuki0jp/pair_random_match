import { useRecoilState,useRecoilValue } from 'recoil';
import React, { useEffect, useRef, useState } from 'react';
import {membersAtom , constructAtom, ConstructResult, PairProfile, Pair, Construct} from './State';
import { searchPairPattern } from './Logic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faGear, faPencil,faCheck, faCalendarDays, faUserGroup } from '@fortawesome/free-solid-svg-icons';

function PairConstruct(props:{pair:PairProfile,match_pairs:number,updatefunc:(newPair:PairProfile)=>void}){
    const pairs = [2,3,4,5]
    const [edit,setEdit] = useState(false)
    const [pair,setPair] = useState(props.pair.pair_cnt)

    useEffect(()=>{
        setPair(props.pair.pair_cnt)
    },[props])

    const updatePair = (new_cnt:number) => {
        const new_pair:PairProfile = {idx:props.pair.idx,pair_cnt:new_cnt}
        props.updatefunc(new_pair)
        setEdit(false)
    }
    
    const editPair = () => {
        setEdit(true)
    }

    return (
        <div style={{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',borderBottom:'solid',color:!edit? 'gray':'blue'}}>
            <FontAwesomeIcon icon={faUserGroup} size="xl" style={{marginLeft:'10px',}}/>
            {edit ? <select onChange={e => {setPair(parseInt(e.target.value))}}>
                {pairs.map(cnt => <option value={cnt} selected={cnt==props.pair.pair_cnt}>{cnt}人ペア</option>)}
            </select>:<span>{props.pair.pair_cnt}人ペア：{props.match_pairs===undefined ? 0:props.match_pairs}組作成</span>}
            {!edit ? <FontAwesomeIcon icon={faPencil} size="xl" style={{marginLeft:'10px'}} onClick={editPair}/>:<FontAwesomeIcon icon={faCheck} size="xl" style={{color:'green'}} onClick={e => {updatePair(pair)}}/>}
        </div>
    )
}

function ConstructPairSetting(){
    const [construct,setConstruct] = useRecoilState(constructAtom)
    const members = useRecoilValue(membersAtom)
    const pairs:ConstructResult = members.length > 0 ? searchPairPattern(construct,members.length,construct.pairs[0].pair_cnt < construct.pairs[1].pair_cnt):{}

    const updatePair = (newPair:PairProfile) => {
        let newConstruct:Construct = JSON.parse(JSON.stringify(construct))
        newConstruct.pairs = newConstruct.pairs.map((item:PairProfile) => {
            return item.idx === newPair.idx ? newPair:item;
        });
        setConstruct(newConstruct)
    }

    return (
        <div>
            {construct.pairs.map(p => <PairConstruct pair={p} match_pairs={pairs[p.pair_cnt]} updatefunc={updatePair}/>)}
        </div>
    )
}

function ConstructWorkSetting(){
    const [construct,setConstruct] = useRecoilState(constructAtom)
    const [edit,setEdit] = useState(false)
    const [days,setDay] = useState(construct.work_day)
    const inputName = useRef<HTMLInputElement>(null)

    const updateWorkDay = (workday:number) => {
        let newConstruct:Construct = JSON.parse(JSON.stringify(construct))
        newConstruct.work_day = workday
        setConstruct(newConstruct)
        setEdit(false)
    }

    const editDay = () => {
        setEdit(true)
        inputName.current?.focus()
    }

    return (
        <div style={{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',borderBottom:'solid',color:!edit? 'gray':'blue'}}>
            <FontAwesomeIcon icon={faCalendarDays} size="xl" style={{marginLeft:'10px',}}/>
            <input ref={inputName} style={{fontSize:'12pt',maxWidth:'150px',appearance:'none',outline:0,border:'none'}} value={days} onChange={e=>{setDay(isNaN(parseInt(e.target.value)) ? 1:parseInt(e.target.value))}} readOnly={!edit}></input>
            {!edit ? <FontAwesomeIcon icon={faPencil} size="xl" style={{marginLeft:'10px'}} onClick={editDay}/>:<FontAwesomeIcon icon={faCheck} size="xl" style={{color:'green'}} onClick={e => {updateWorkDay(days)}}/>}
        </div>
    )
}

function ConstructDescribe(){
    const construct = useRecoilValue(constructAtom)
    const members = useRecoilValue(membersAtom)
    const pair_result = searchPairPattern(construct,members.length,construct.pairs[0].pair_cnt < construct.pairs[1].pair_cnt)

    return (
        <div>
            {construct.pairs.map(pair => <h3>{pair.pair_cnt}人ペア：{pair_result[pair.pair_cnt]===undefined ? 0:pair_result[pair.pair_cnt]}組作成</h3>)}
            <h3>作成期間：{construct.work_day}日</h3>
        </div>
    )
}

function ConstructSetting(){
    const [view,setView] = useState(true)
    return <div style={{minWidth:'300px',maxWidth:'480px',width:'100vw',paddingTop:'0.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',borderBottom:'double 5px #5490cc',color:'#5490cc',userSelect:'none'}} onClick={()=>{setView(!view)}}>
                <FontAwesomeIcon icon={faEllipsisVertical} size='xl' style={{marginLeft:'10px'}}/>
                <span style={{fontSize:'15pt',maxWidth:'100%',appearance:'none',outline:0,border:'none',fontWeight:'bolder'}}>ペア作成設定</span>
                <FontAwesomeIcon icon={faGear} size='xl' style={{marginLeft:'10px'}}/>
        </div>
        {!view && <ConstructDescribe/>}
        {view && <ConstructPairSetting />}
        {view && <ConstructWorkSetting />}
    </div>
}

export default ConstructSetting