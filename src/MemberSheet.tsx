import { useAtom } from 'jotai';
import React, { useRef, useState } from 'react';
import {membersAtom} from './State';
import { combination, searchPairPattern } from './Logic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faList, faPencil, faPlus, faRemove, faUser } from '@fortawesome/free-solid-svg-icons';


function MemberRow(props:{idx:number})
{
    const [members,setMember] = useAtom(membersAtom)
    const [name,setName] = useState(members.filter((member)=> member.idx===props.idx)[0].name)
    const [edit,setEdit] = useState(false)
    const inputName = useRef<HTMLInputElement>(null)

    const updateMember = () => {
        if(name === '')
        {
            alert('名前を空欄にできません。名前を設定してください')
        }else{
            setEdit(!edit)
            let newData = members.filter((item) => {
                return item.idx !== props.idx ? true:false;
            });
            let changeData = members.filter((item) => {
                return item.idx === props.idx ? true:false;
            });
            changeData[0].name=name
            setMember([...newData,changeData[0]])
        }
    }
    const editMember = () => {
        setEdit(true)
        inputName.current?.focus()
    }
    const deleteMember = () => {
        let newData = members.filter((item) => {
            return item.idx !== props.idx ? true:false;
          });
        setMember([...newData])
    }

    return (
        <li style={{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',borderBottom:'solid',color:!edit? 'gray':'blue'}}>
            {edit ? <FontAwesomeIcon icon={faRemove} size="xl" style={{marginLeft:'10px',color:'red'}} onClick={deleteMember}/>:<FontAwesomeIcon icon={faUser} size="xl" style={{marginLeft:'10px',}}/>}
            <input ref={inputName} style={{fontSize:'12pt',maxWidth:'150px',appearance:'none',outline:0,border:'none'}} value={name} onChange={e=>{setName(e.target.value)}} readOnly={!edit}></input>
            {!edit ? <FontAwesomeIcon icon={faPencil} size="xl" style={{marginLeft:'10px'}} onClick={editMember}/>:<FontAwesomeIcon icon={faCheck} size="xl" style={{color:'green'}}onClick={updateMember}/>}
        </li>
    )
}

function MemberSheet(){
    const [members,setMember] = useAtom(membersAtom)
    return (
        <div style={{'minWidth':'300px',maxWidth:'480px',width:'40vw',padding:'0.5rem'}}>
            <div 
                style={{display:'flex',margin:'0.1rem','justifyContent':'space-between',padding:'0.5rem 0.5rem',border:'solid',borderRadius:'10px',color:'white',backgroundColor:"#77bb41"}}
                unselectable={'on'}
                onClick={e=>{setMember([...members,{idx:members.length > 0 ? members.reduce((a,b)=> a.idx>b.idx ? a:b).idx+1:1, name:'名前'+String(members.length > 0 ? members.reduce((a,b)=> a.idx>b.idx ? a:b).idx+1:1),level:0}])}}
            >
                <FontAwesomeIcon icon={faPlus} size='xl' style={{marginLeft:'10px'}}/>
                <span style={{fontSize:'15pt',maxWidth:'100%',appearance:'none',outline:0,border:'none'}}>名簿に追加</span>
                <FontAwesomeIcon icon={faList} size='xl' style={{marginLeft:'10px'}}/>
            </div>

            {members.sort((a,b)=> a.idx-b.idx).map(m => <MemberRow idx={m.idx}/>)}
            <button onClick={e=>{
                alert(JSON.stringify(combination(members,3).length))
            }}>ペア組み合わせテスト</button>
            
        </div>
    )
}

export default MemberSheet