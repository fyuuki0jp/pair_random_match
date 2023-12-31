import { useRecoilState } from 'recoil';
import React, { useEffect, useRef, useState } from 'react';
import {Member, membersAtom} from './State';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEllipsisVertical, faList, faPencil, faPlus, faRemove, faUser } from '@fortawesome/free-solid-svg-icons';


function MemberRow(props:{member:Member,deletefunc:(idx:number)=>void,updatefunc:(newMember:Member)=>void})
{
    const [name,setName] = useState(props.member.name)
    const [edit,setEdit] = useState(false)
    const inputName = useRef<HTMLInputElement>(null)

    const updateMember = () => {
        if(name === '')
        {
            alert('名前を空欄にできません。名前を設定してください')
        }else{
            setEdit(false)
            props.updatefunc({idx:props.member.idx,name:name,level:props.member.level})
        }
    }
    const deleteMember = () => {
        setEdit(false)
        props.deletefunc(props.member.idx)
    }
    const editMember = () => {
        setEdit(true)
        inputName.current?.focus()
    }

    useEffect(()=>{
        setName(props.member.name)
    },[props])

    return (
        <li style={{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',borderBottom:'solid',color:!edit? 'gray':'blue'}}>
            {edit ? <FontAwesomeIcon icon={faRemove} size="xl" style={{marginLeft:'10px',color:'red'}} onClick={deleteMember}/>:<FontAwesomeIcon icon={faUser} size="xl" style={{marginLeft:'10px',}}/>}
            <input ref={inputName} style={{fontSize:'12pt',maxWidth:'150px',appearance:'none',outline:0,border:'none'}} value={name} onChange={e=>{setName(e.target.value)}} readOnly={!edit}></input>
            {!edit ? <FontAwesomeIcon icon={faPencil} size="xl" style={{marginLeft:'10px'}} onClick={editMember}/>:<FontAwesomeIcon icon={faCheck} size="xl" style={{color:'green'}}onClick={updateMember}/>}
        </li>
    )
}

function MemberSheet(){
    const [members,setMember] = useRecoilState(membersAtom)
    const [view,setView] = useState(true)

    const addMember = () =>{
        const new_id:number = members.length > 0 ? members.reduce((a,b)=> a.idx>b.idx ? a:b).idx+1:1
        let new_member:Member = {idx:new_id,name:'名前'+new_id,level:0}
        setMember([...members,new_member].sort((a,b) => a.idx-b.idx))
    }
    const deleteMember = (idx:number) => {
        let newData = members.filter((item) => {
            return item.idx !== idx ? true:false;
          }).sort((a,b) => a.idx-b.idx);
        setMember([...newData])
    }
    const updateMember = (newMember:Member) => {
        let newData = members.map((item:Member) => {
            return item.idx === newMember.idx ? newMember:item;
        }).sort((a,b) => a.idx-b.idx);
        setMember([...newData])
    }

    const addClipMember = () => {
        if(navigator.clipboard){
            let idx = 0
            navigator.clipboard.readText()
            .then(function(text){
                setMember(text.split('\n').filter((name:string)=>{return name !== ''}).map((name:string):Member => {return {idx:idx++,name:name,level:0}}))
            });
        }
    }


    return (
        <div style={{minWidth:'300px',maxWidth:'480px',width:'100vw'}}>
            <div style={{display:'flex',justifyContent:'space-between',borderBottom:'double 5px #5490cc',color:'#5490cc',userSelect:'none'}} onClick={()=>{setView(!view)}}>
                <FontAwesomeIcon icon={faEllipsisVertical} size='xl' style={{marginLeft:'10px'}}/>
                <span style={{fontSize:'15pt',maxWidth:'100%',appearance:'none',outline:0,border:'none',fontWeight:'bolder'}}>名簿</span>
                <FontAwesomeIcon icon={faUser} size='xl' style={{marginLeft:'10px'}}/>
            </div>
            {view &&
                (
                <div 
                    style={{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',border:'solid',borderRadius:'10px',color:'white',backgroundColor:'#5490cc',userSelect:'none'}}
                    unselectable={'on'}
                    onClick={e=>{addMember()}}
                >
                    <FontAwesomeIcon icon={faPlus} size='xl' style={{marginLeft:'10px'}}/>
                    <span style={{fontSize:'15pt',maxWidth:'100%',appearance:'none',outline:0,border:'none'}}>名簿に追加</span>
                    <FontAwesomeIcon icon={faList} size='xl' style={{marginLeft:'10px'}}/>
                </div>
                )
            }
            <div style={{overflowY:'auto',minHeight:'500px',height:'65vh' }}>
                {view && members.map(m => {return <MemberRow member={m} deletefunc={deleteMember} updatefunc={updateMember}/>})}
                {!view && <h3>メンバー：{members.length}人</h3>}
            </div>
            <div 
                    style={{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',border:'solid',borderRadius:'10px',color:'white',backgroundColor:'#5490cc',userSelect:'none'}}
                    unselectable={'on'}
                    onClick={e=>{addClipMember()}}
                >
                    <FontAwesomeIcon icon={faPlus} size='xl' style={{marginLeft:'10px'}}/>
                    <span style={{fontSize:'15pt',maxWidth:'100%',appearance:'none',outline:0,border:'none'}}>クリップボードから名簿を取り込む</span>
                    <FontAwesomeIcon icon={faList} size='xl' style={{marginLeft:'10px'}}/>
                </div>
        </div>
    )
}

export default MemberSheet

