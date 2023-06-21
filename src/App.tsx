import React from 'react';
import './App.css';
import MemberSheet from './MemberSheet';
import ConstructSetting from './Construct';

function App() {
  return (
    <div className="App" style={{display:'flex'}}>
      <MemberSheet/>
      <ConstructSetting/>
    </div>
  );
}

export default App;
