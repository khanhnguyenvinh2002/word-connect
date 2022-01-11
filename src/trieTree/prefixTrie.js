class PrefixTreeNode {
    constructor(value) {
      this.children = {};
      this.endWord = null;
      this.value = value;
    }
  }

class PrefixTree extends PrefixTreeNode {
  constructor() {
    super(null);
  }
  
  serialize = function(root){
    let res = []
    function helper(node){
      if(!node){
        return ""
      }
      res.push(node.value)
      if(node.children){
        res.push(Object.keys(node.children).length)
        for(const i of Object.keys(node.children)){
            helper(node.children[i])
          }
      }
      else{
        res.push(0);
      }
    }
    helper(this)
    return res.join(",");
  }
  deserialize = function (data){
    let index = 0
    let d = data.split(",")
    console.log(d)
    function helper(res){
      if(!res.length){
        return
      }
      let val = res[index++]
      let node = new PrefixTreeNode(val)
      let size = res[index++]
      for(let i =0;i< size;i++){
        let temp = helper(res)
        node.children[temp.value] = temp
      }
      return node
    }
    return helper(d)
  }
  addWord(word) {
    const addWordHelper = (node, str) => {
      if (!node.children[str[0]]) {
        node.children[str[0]] = new PrefixTreeNode(str[0]);
      }

      if (str.length === 1) {
        node.children[str[0]].endWord = 1; //set the end word, even if a longer word exists already
      } else if (str.length > 1) {
        addWordHelper(node.children[str[0]], str.slice(1));
      }
    };
    addWordHelper(this, word);
  }
}
let prefixTree = new PrefixTree();
var fs = require("fs");
var text = fs.readFileSync("../words_alpha.txt", "utf-8");
text = text.replace(/(\r\n|\n|\r)/gm, "\n");
var textByLine = text.split("\n")
textByLine.forEach(w => prefixTree.addWord(w))
fs.writeFile('serialized_words_prefix.txt', prefixTree.serialize(), (err) => {
    if (err) throw err;
})
  
// export default PrefixTree;
  