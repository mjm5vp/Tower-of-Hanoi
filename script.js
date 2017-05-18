peg = $(".peg")
numBlocksSelector = $("select")
movesDisplay = $(".moves")
timerDisplay = $(".timer")
numBlocks = 5
timer = 0
first = 0


numBlocksSelector.change(startGame)
peg.on("click", clickedPeg)
$("img").on("click",displayInfoWindow)

$(".winner").on("click", function(){
  console.log("click winner")
})

var user = {
  moves: 0,
  minMoves: 0,
  thisTimer: null,
  totalScore: 0,

  updateScore(){
    this.moves++
    movesDisplay.text("Moves: " + this.moves)
  },

  win(){
    peg.off("click")
    peg.off("click", clickedPeg)
    this.stopTimer()
    $(".winner").css("display", "unset")
    $("#moves").text("Moves: " + this.moves)
    $("#time").text("Time: " + timer)
    $("#best").text("Best possible score: " + this.minMoves + " moves")
    $("button").css("display", "unset")
    $("button").on("click",startGame)
    this.totalScore++
    localStorage.setItem("totalScore", this.totalScore)
    $("#totalWins").text("Total Wins: " + this.totalScore)
  },

  bestPossible(num){
    this.minMoves = Math.pow(2,num) - 1
  },

  startTimer(){
    this.thisTimer = setInterval(this.displayTimer,1000)
  },

  stopTimer(){
    clearInterval(this.thisTimer)
  },

  displayTimer(){
    timer++
    timerDisplay.text("Time: " + timer)
  },

  refreshDisplay(){
    timerDisplay.text("Time: " + timer)
    movesDisplay.text("Moves: " + this.moves)
  }

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
    var block1 = pegStart[pegStart.length - 1]
    var block2 = pegEnd[pegEnd.length - 1]
    if (block2 == undefined || this.blockSizeWorks(block1,block2) == true) {
      pegStart.pop()
      pegEnd.push(block1)
      user.updateScore()
      this.checkIfWin()
    }

      this.updateTower()

  },

  clearTowerView(){
    peg.empty()
  },

  restartTower(){
    peg.empty()
    this.peg1 = []
    this.peg2 = []
    this.peg3 = []
  },

  updateTower() {
    this.clearTowerView()
    this.updatePeg(this.peg1, 1)
    this.updatePeg(this.peg2, 2)
    this.updatePeg(this.peg3, 3)
  },

  updatePeg(pegNum, num){
    for (var i = pegNum.length - 1; i >= 0; i--) {
      var width = pegNum[i].size * 15 + 10
      var createdBlock = $("<div></div>")
      createdBlock.addClass("block")
      createdBlock.css("width", width)
      //createdBlock.css("background-color", pegNum[i].color)
      imageUrl = "images/stone.jpg"
      backPosX = pegNum[i].colorX + "% "
      backPosY = pegNum[i].colorY + "%"
      backPos = backPosX + backPosY
      //console.log("backPos: " + backPos)
      createdBlock.css("background-position", backPos)
      console.log("numBlocks: " + numBlocks)
      var check = numBlocks + 1
      console.log("check: " + check)
      console.log("first: " + first)



      createdBlock.attr("id", pegNum[i].id)

      if (first < numBlocks) {
        createdBlock.css("display", "none")
        console.log("display none")
        first++
      }else{
        console.log("display fixed?")
        createdBlock.css("display", "")
      }

      //console.log(createdBlock.css("background-position"))
      //createdBlock.css('background', 'url(' + imageUrl + ')')
      $("#peg" + num).append(createdBlock)
    }
  },

  checkIfWin(){
    if (this.peg1[0] == null && (this.peg2[0] == null || this.peg3[0] == null)) {
      console.log("WINNER!!!!!!")
      console.log(`Best possible score with ${numBlocks} blocks: ${user.minMoves}`)
      user.win()
    }
  }
}


class Block{
  constructor(size, id){
    this.size = size
    this.colorX = Math.floor((Math.random() * 100) + 1)
    this.colorY = Math.floor((Math.random() * 100) + 1)
    this.id = "block" + id
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
function createStartBoard(numBlocks=4){
  numBlocks++
  for (var i = 1; i < numBlocks; i++) {
    var newBlock = new Block(i, i)
    tower.peg1.unshift(newBlock)
  }
}


function createOptionValues() {
  for (var i = 3; i < 11; i++) {
    var newOption = $("<option></option>")
    newOption.attr("value",i)
    newOption.text(i)
    $("select").append(newOption)
  }
  numBlocksSelector.val('4')

}

function clickedPeg(){
  removeAnimation()
  pegClick1 = this.id
  if (tower[pegClick1][0] != null) {
    console.log("1: " + this.id)
    tower.click1 = this.id

    $(this).children().first().addClass("clickedPeg")
    //$(this).addClass("clickedPeg")
    peg.off("click")
    peg.on("click", secondClickedPeg)
    $(this).off("click")
  }

}

function removeAnimation(){
  for (var i = 0; i < tower.peg1.length; i++) {
    var blockId = "#" + tower.peg1[i].id
    $(blockId).removeClass("animate")
  }
}

function secondClickedPeg(){
  pegClick2 = this.id
  console.log("2: " + pegClick2)
  tower.click2 = pegClick2
  peg.removeClass("clickedPeg")

  peg.off("click",secondClickedPeg)
  peg.on("click", clickedPeg)

  tower.move(tower[pegClick1],tower[pegClick2])





  displayTower()
}

function animateStones(){
  var timeout = []
  var offset = 0
  setTimeout(function() { loopStones(0); }, 500);
}

function loopStones(index) {
   if (index < tower.peg1.length) {
       var blockId = "#" + tower.peg1[index].id
       $(blockId).css("display", "")
       $(blockId).addClass("animate")
       setTimeout(function() { loopStones(index+1) }, 75);
   }
}


function startGame(){
  user.totalScore = localStorage.getItem("totalScore")
  user.moves = 0
  timer = 0
  first = 0
  $(".winner").css("display", "none")
  $("button").css("display", "none")
  user.stopTimer()
  user.refreshDisplay()
  console.log("startGame")
  numBlocks = numBlocksSelector.val()
  console.log("numBlocks: " + numBlocks)
  tower.restartTower()
  createStartBoard(numBlocks)
  turnDisplayOff()
  peg.on("click", clickedPeg)
  tower.updateTower()
  user.bestPossible(numBlocks)
  peg.off("click", startTimerOnClick)
  peg.on("click", startTimerOnClick)
  animateStones()
}

function turnDisplayOff(){
  for (var i = 0; i < tower.peg1.length; i++) {
    var blockId = "#" + tower.peg1[i].id
    $(blockId).css("display", "none")
  }
}

function startTimerOnClick(){
  user.startTimer()
  peg.off("click", startTimerOnClick)
}

function randomizeWood(){
  for (var i = 1; i < 4; i++) {
    var baseName = $("#base" + i)
    var baseX = Math.floor((Math.random() * 100) + 1)
    var baseY = Math.floor((Math.random() * 100) + 1)
    var basePos = baseX + "% " + baseY + "%"
    baseName.css("background-position", basePos)
  }

  for (var i = 1; i < 4; i++) {
      var standName = $("#stand" + i)
      var standX = Math.floor((Math.random() * 100) + 1)
      var standY = Math.floor((Math.random() * 100) + 1)
      var standPos = standX + "% " + standY + "%"
      standName.css("background-position", standPos)
    }
}

function displayInfoWindow(){
  $(".infoWindow").toggleClass("displayToggle")
}



function displayTower(){
  console.log("peg1 : " + tower.peg1)
  console.log("peg2 : " + tower.peg2)
  console.log("peg3 : " + tower.peg3)
}



randomizeWood()
createOptionValues()
console.log(tower.numBlocks)
startGame()
//tower.updateTower()
