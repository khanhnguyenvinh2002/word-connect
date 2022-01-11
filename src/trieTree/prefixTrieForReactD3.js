import Guid from "guid";

//react-d3-tree requires a tree in this format. PrefixTrie.js is a little different.
export default class D3CompatibleTree {
  constructor(prefixTrie) {
    const mapNode = (node, parentNode) => {
      var newObj = { name: node.value, attributes: {}, guid: Guid.raw() };
      if (node.endWord === 1) newObj.attributes.endWord = true;

      var childrenArray = Object.keys(node.children).filter(function(key) {
        return key !== "endWord" || key !== "value" || key !== "children";
      });
      if (childrenArray.length > 0) {
        newObj.children = childrenArray.map(function(key, index) {
          return mapNode(node.children[key], newObj);
        });
      }

      return newObj;
    };

    var treeForReactD3Tree = mapNode(prefixTrie, null);
    this.name = treeForReactD3Tree.name;
    this.attributes = treeForReactD3Tree.attributes;
    this.guid = treeForReactD3Tree.guid;
    this.children = treeForReactD3Tree.children;
  }

  getPriorNodes(node) {
    var correctPriorNodesForCurrentNode;
    const traverse = (n, priorNodes) => {
      if (n.guid === node.guid) {
        correctPriorNodesForCurrentNode = priorNodes;
        return;
      }

      if (n.name && n.name !== null) priorNodes.push(n);

      if (n.children) {
        n.children.forEach(function(cn) {
          traverse(cn, priorNodes.slice()); //use slice to copy to a new array, this is required for seperate/distinct prior node paths and this method to work correctly
        });
      }
    };

    traverse(this, []);
    return correctPriorNodesForCurrentNode;
  }

  getFollowingNodePaths(node) {
    var nodePaths = [];
    const traverse = (n, nodesOnThisPath) => {
      if (!n || !n.name || n.name === null) return;

      nodesOnThisPath.push(n);

      if (n.attributes && n.attributes.endWord) {
        nodePaths.push(nodesOnThisPath);
        nodesOnThisPath = nodesOnThisPath.slice(); //copy to new array, to not mutate the previous word found (one already pushed)
      }

      if (n.children) {
        n.children.forEach(function(cn) {
          traverse(cn, nodesOnThisPath.slice());
        });
      }
    };

    traverse(node, []);
    return nodePaths;
  }
}
