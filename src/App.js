import './App.css';
import React from 'react';
import English from "./english/English"
import Vietnamese from './vietnamese/Vietnamese';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      instructionMode: false
    }
  }
  render(){
    return (
      <div>
        <div style={{display: "flex", justifyContent: "flex-end", height: "10vh", backgroundColor: "#282c34"}}>
          <button className="header_btn" onClick={(e)=>{
            e.preventDefault();
            this.setState({isEnglish: !this.state.isEnglish})
          }}>{this.state.isEnglish? "Vietnamese": "English"}</button>
          <button className="header_btn" onClick={(e)=>{
                e.preventDefault();
                this.setState({instructionMode: !this.state.instructionMode})
            }}>How to play</button>
        </div>
        {this.state.isEnglish ? <English instructionMode={this.state.instructionMode}/> : <Vietnamese instructionMode={this.state.instructionMode}/>}
      </div>
    );
  }
}

export default App;
