import React from 'react';
import logo from './logo.svg';
import './App.css';
import MemberSheet from './MemberSheet';
import { searchPairPattern } from './Logic';

function App() {
  console.log(searchPairPattern([2,3],15))
  return (
    <div className="App">
      <MemberSheet/>
    </div>
  );
}

export default App;
