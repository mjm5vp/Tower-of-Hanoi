peg = $(".peg")
peg.on("click", clickedPeg)
blockHeight = 20

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
    //console.log("pegStart: " + pegStart)
    //console.log("pegEnd: " + pegStart)
    var block1 = pegStart[pegStart.length - 1]
    var block2 = pegEnd[pegEnd.length - 1]
    //console.log("block1: " + block1)
    //console.log("block2: " + block2)
    if (block2 == undefined || this.blockSizeWorks(block1,block2) == true) {
      pegStart.pop()
      pegEnd.push(block1)
    }
    this.updateTower()
  },
  clearTower(){
    peg.empty
  },

  updateTower() {
    peg.empty()
    for (var i = this.peg1.length - 1; i >= 0; i--) {
      //var bottomPosition = (24 * i) + "px"

      console.log("UT i 1: " + i)
      var width = this.peg1[i].size * 10 + 10
      var createdBlock = $("<div></div>")
      createdBlock.addClass("block")
      createdBlock.css("width", width)
      //createdBlock.attr("id","block" + i)
      $("#peg1").append(createdBlock)
    }

    for (var i = this.peg2.length - 1; i >= 0; i--) {
      //var bottomPosition = (24 * i) + "px"
      console.log("UT i 2: " + i)
      var width = this.peg2[i].size * 10 + 10
      var createdBlock = $("<div></div>")
      createdBlock.addClass("block")
      createdBlock.css("width", width)
      //createdBlock.attr("id","block" + i)
      $("#peg2").append(createdBlock)
    }

    for (var i = this.peg3.length - 1; i >= 0; i--) {
      //var bottomPosition = (24 * i) + "px"

      console.log("UT i 3: " + i)
      var width = this.peg3[i].size * 10 + 10
      var createdBlock = $("<div></div>")
      createdBlock.addClass("block")
      createdBlock.css("width", width)
      //createdBlock.attr("id","block" + i)
      $("#peg3").append(createdBlock)
    }


  }


}


class Block{
  constructor(size){
    this.size = size
//    this.position = 1
  }

  createBlock(i) {
    var width = this.size * 10 + 10
    var createdBlock = $("<div></div>")
    createdBlock.addClass("block")
    createdBlock.css("width", width)
    createdBlock.attr("id","block" + i)
    //createdBlock.css("bottom", bottomPosition)
    //$("#peg1").prepend(createdBlock)
  }


}

for (var i = 1; i < 5; i++) {
  var newBlock = new Block(i)
  //newBlock.createBlock(i)
  tower.peg1.unshift(newBlock)
}





//tower.move(tower.peg1,tower.peg2)
//tower.move(tower.peg1,tower.peg2)


function displayTower(){
console.log("peg1 : " + tower.peg1)
console.log("peg2 : " + tower.peg2)
console.log("peg3 : " + tower.peg3)
}

tower.updateTower()
