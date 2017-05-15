var tower = {
  peg1: [],
  peg2: [],
  peg3: [],

  blockSizeWorks(block1, block2){
    if (block1.size > block2.size) {
      console.log("This block can't be moved to that peg")
      return false
    }else{
      return true
    }
  },

  move(pegStart, pegEnd) {
    console.log(pegStart)
    var block1 = pegStart[pegStart.length - 1]
    var block2 = pegEnd[pegEnd.length - 1]
    console.log("block1: " + block1)
    console.log("block2: " + block2)
    if (block2 == undefined || this.blockSizeWorks(block1,block2) == true) {
      pegStart.pop()
      pegEnd.push(block1)
    }
  }


}


class Block{
  constructor(size){
    this.size = size
  }


}

for (var i = 4; i > 0; i--) {
  var newBlock = new Block(i)
  tower.peg1.push(newBlock)
}

tower.move(tower.peg1,tower.peg2)
tower.move(tower.peg1,tower.peg2)

console.log("peg1 : " + tower.peg1)
console.log("peg2 : " + tower.peg2)
console.log("peg3 : " + tower.peg3)
