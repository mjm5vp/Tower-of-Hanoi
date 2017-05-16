peg = $(".peg")
numBlocksSelector = $("#numBlocksSelect")
numBlocks = 5

// numBlocksSelector.change(function(){
//   numBlocks = numBlocksSelector.val()
//   createStartBoard()
// })

peg.on("click", clickedPeg)

var tower = {
  peg1: [],
  peg2: [],
  peg3: [],

  click1: "",
  click2: "",


  blockSizeWorks(block1, block2){
    if (block1.size > block2.size) {
      console.log("This block can't be moved to that peg")
      return false
    }else{
      return true
    }
  },

  move(pegStart, pegEnd) {
    var block1 = pegStart[pegStart.length - 1]
    var block2 = pegEnd[pegEnd.length - 1]
    if (block2 == undefined || this.blockSizeWorks(block1,block2) == true) {
      pegStart.pop()
      pegEnd.push(block1)
    }
    this.updateTower()
  },

  clearTower(){
    peg.empty()
  },

  updateTower() {
    this.clearTower()
    this.updatePeg(this.peg1, 1)
    this.updatePeg(this.peg2, 2)
    this.updatePeg(this.peg3, 3)
  },

  updatePeg(pegNum, num){
    for (var i = pegNum.length - 1; i >= 0; i--) {
      var width = pegNum[i].size * 10 + 10
      var createdBlock = $("<div></div>")
      createdBlock.addClass("block")
      createdBlock.css("width", width)
      //createdBlock.css("background-color", pegNum[i].color)
      $("#peg" + num).append(createdBlock)
    }
  }
}


class Block{
  constructor(size){
    this.size = size
    //this.color = color
  }

  createBlock(i) {
    var width = this.size * 10 + 10
    var createdBlock = $("<div></div>")
    createdBlock.addClass("block")
    createdBlock.css("width", width)
    createdBlock.attr("id","block" + i)
  }


}
function createStartBoard(){
  for (var i = 1; i < numBlocks; i++) {
    //var color = getRandomColor()
    var newBlock = new Block(i)
    //newBlock.createBlock(i)
    tower.peg1.unshift(newBlock)
  }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createOptionValues() {
  for (var i = 3; i < 11; i++) {
    var newOption = $("<option></option>")
    newOption.attr("value",i)
    newOption.text(i)
    $("select").append(newOption)
  }


}

function clickedPeg(){
  console.log("1: " + this.id)
  tower.click1 = this.id
  pegClick1 = this.id
  $(this).toggleClass("clickedPeg")
  peg.off("click")
  peg.on("click", secondClickedPeg)
  $(this).off("click")
}

function secondClickedPeg(){
  pegClick2 = this.id
  console.log("2: " + pegClick2)
  tower.click2 = pegClick2
  tower.move(tower[pegClick1],tower[pegClick2])


  peg.removeClass("clickedPeg")
  peg.off("click",secondClickedPeg)
  peg.on("click", clickedPeg)

  displayTower()
}



function displayTower(){
console.log("peg1 : " + tower.peg1)
console.log("peg2 : " + tower.peg2)
console.log("peg3 : " + tower.peg3)
}



createOptionValues()
console.log(tower.numBlocks)
createStartBoard()
tower.updateTower()
