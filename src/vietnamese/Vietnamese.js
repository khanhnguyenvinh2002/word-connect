import '../App.css';
import wordFile from "../serialized_words_vietnamese.txt"
import RadixTree from "../trieTree/radixTree";
import React from 'react';


class Vietnamese extends React.Component{
    constructor(props){
      super(props)
      this.state ={
        userTurn: false,
        currentWord: "",
        inValidWord: false,
        winnerMessage: "",
        errorMessage: "",
        userWord: "",
        userScore: 0,
        computerScore: 0
      }
    }
    componentDidMount(){
      this.startNewGame()
    }
    random(max){
      return Math.floor((Math.random() * parseInt(max)) );
    }
    surrender(){
        this.setState({winnerMessage: "You surrendered!"})
        this.setState({computerScore: this.state.computerScore+1})
        this.startNewGame()
    }
    startNewGame(){
      fetch(wordFile)
      .then(r => r.text())
      .then(text => {
        let radixTree = new RadixTree()
        this.setState({radixTree: radixTree.deserialize(text)})
        let arr =this.state.radixTree.getWords('').filter(i => i.split(" ").length >1)
        this.setState({currentWord: arr[this.random(arr.length)], userTurn: true})
        let nextWords = this.state["radixTree"].getWords(this.state.currentWord.split(" ").pop()).filter(i => i.split(" ").length >1 && i.split(" ")[0] === this.state.currentWord.split(" ").pop() )
        if(nextWords.length == 0) this.startNewGame()
        console.log(nextWords)
      });
    }
    selectWord(e, word){
      e.preventDefault()
      this.setState({winnerMessage: ""})
      this.setState({userWord:""})
      if(word.split(" ")[0] !== this.state.currentWord.split(" ").slice(-1)[0]){
  
        this.setState({errorMessage: `Vui lòng nhập từ bắt đầu với: ${this.state.currentWord.split(" ").slice(-1)[0]}`})
        this.setState({inValidWord: true})
        return
      }
      if(word.split(" ").length < 2){
        console.log(word.split(" ").length)
        this.setState({errorMessage: "Vui lòng chỉ nhập trên 2 từ"})
        this.setState({inValidWord: true})
        return
      }
  
      if(this.state["radixTree"].checkWord(word)){
        this.state["radixTree"].deleteWord(word)
        this.setState({inValidWord: false})
        //set next words
        let nextWords = this.state["radixTree"].getWords(word.split(" ").pop()).filter(i => i.split(" ").length >1 &&i.split(" ")[0] === word.split(" ").pop())
        console.log(nextWords)
        //user wins
        if(nextWords.length === 0) {
          this.setState({winnerMessage: "You won"})
          this.setState({userScore: this.state.userScore+1})
          this.startNewGame()
          return
        }
        let nextWord = nextWords[this.random(nextWords.length)]
        console.log(nextWord)
        this.state["radixTree"].deleteWord(nextWord)
  
        this.setState({currentWord: nextWord})
        let next = this.state["radixTree"].getWords(nextWord.split(" ").pop()).filter(i => i.split(" ").length >1 &&i.split(" ")[0] === nextWord.split(" ").pop())
        console.log(next)
        //computer wins if next words does not have anything
        if(next.length === 0) {
          this.setState({winnerMessage: `Computer won with the word: ${nextWord}`})
          this.setState({computerScore: this.state.computerScore+1})
          this.startNewGame()
          return
        }
  
        this.setState({radixTree: this.state["radixTree"]})
        this.setState({currentWord: nextWord})
      }
      else{
        this.setState({errorMessage: "Từ không hợp lệ, hãy nhập từ khác"})
        this.setState({inValidWord: true})
      }
    }
    // let [tree, setTree] = useState(new RadixTree());
    // let radixTree = new RadixTree();
    // useEffect(()=>{
    // },[wordFile])
    
    // console.log(tree.getWords('fan'))
    render(){
      return (
        <div className="App">
          <div className="App-header">
              {this.props.instructionMode && <div>Find a word that begins with the same word as the last word of the word the other selected. You will lose if you cannot find a word or there are no available words beginning with that word! </div>}
            {this.state.winnerMessage && <h2>{this.state.winnerMessage }</h2>}
            <h1>{this.state.currentWord}</h1>
            <form onSubmit={(e) => {this.selectWord(e, this.state.userWord )}}>
            <input 
            onChange={(e)=> this.setState({userWord: e.target.value})}
            placeholder="Type your word here"
            value={this.state.userWord}></input>
            <input type="submit" style={{display: "none"}} onChange={(e)=> e.preventDefault()}></input>
            <button type="submit" disabled={this.state.userWord === ""} >Use this word</button>
            {this.state.inValidWord && <h1>{this.state.errorMessage}</h1>}
            </form>
            <div style={{display: "flex", justifyContent: "space-between"}}> 
            <h2>Computer Score: {this.state.computerScore}</h2>
            <h2>User Score: {this.state.userScore}</h2>
            </div>
            <button onClick={(e)=>{
                e.preventDefault();
                this.surrender()
            }} style={{alignSelf: "center"}}>Surrender</button>
          </div>
        </div>
      );
    }
}

export default Vietnamese;
