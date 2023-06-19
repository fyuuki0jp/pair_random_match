import { useAtom } from 'jotai';
import React, { useState } from 'react';
import {membersAtom} from './State';
import { searchPairPattern } from './Logic';


function Member(props:{idx:number})
{
    const [members,setMember] = useAtom(membersAtom)
    const [name,setName] = useState(members.filter((member)=> member.idx===props.idx)[0].name)
    const [edit,setEdit] = useState(false)

    const updateMember = () => {
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
    const deleteMember = () => {
        let newData = members.filter((item) => {
            return item.idx !== props.idx ? true:false;
          });
        setMember([...newData])
    }

    return (
    <li onDoubleClick={updateMember}>{!edit ? name:<input value={name} onChange={(e)=>{setName(e.target.value)}}></input>}<button onClick={deleteMember}>削除</button></li>
    )
}

function MemberSheet(){
    const [members,setMember] = useAtom(membersAtom)
    return (
        <div>
            <ul>
                {members.sort((a,b)=> a.idx-b.idx).map(m => <Member idx={m.idx}/>)}
            </ul>
            <button onClick={e=>{setMember([...members,{idx:members.reduce((a,b)=> a.idx>b.idx ? a:b).idx+1, name:'名前',level:0}])}}>追加</button>
            <button onClick={e=>{
                alert(JSON.stringify(searchPairPattern([2,3],members.length)))
            }}>ペア組み数探索</button>
        </div>
    )
}

export default MemberSheet