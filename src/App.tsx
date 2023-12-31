import React from 'react';
import './App.css';
import MemberSheet from './MemberSheet';
import ConstructSetting from './Construct';
import WorkCalender from './CreateTable';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <div className="App" style={{display:'flex'}}>
        <div>
          <ConstructSetting/>
          <MemberSheet/>
        </div>
        <WorkCalender />
      </div>
    </RecoilRoot>
  );
}

export default App;
