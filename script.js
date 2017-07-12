peg = $(".peg")
numBlocksSelector = $("select")
movesDisplay = $(".moves")
timerDisplay = $(".timer")
numBlocks = 5
timer = 0
first = 0

$( document ).ready(function() {

  displayInfoWindow()
  $("#newGameStart").css("display", "unset")
  $("#newGameStart").on("click", function(){
    startGame()
    displayInfoWindow()
    // $(".infoWindow").removeClass("displayToggle")
  })

  // peg.on("click", clickedPeg)

  randomizeWood()
  createOptionValues()
  // startGame()

});

//Starts the Game.  Called on page refresh, when "New Game?" is clickedPeg
//or when the user changes the number of stones.
function startGame(){

  numBlocksSelector.change(function(){
    startGame()

})


  $("img").off("click",displayInfoWindow)
  $("img").on("click",displayInfoWindow)
  user.totalScore = localStorage.getItem("totalScore")
  user.moves = 0
  timer = 0
  first = 0
  $(".winner").css("display", "none")
  $("button").css("display", "none")
  user.stopTimer()
  user.refreshDisplay()
  numBlocks = numBlocksSelector.val()
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

//User Object Literal
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
    $("#newGame").css("display", "unset")
    $("#newGame").on("click",startGame)
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

//Tower obeject literal.  Containts three array properties for each peg,
//two properties to store clicks, and methods to move and update the stones.
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
      imageUrl = "images/stone.jpg"
      backPosX = pegNum[i].colorX + "% "
      backPosY = pegNum[i].colorY + "%"
      backPos = backPosX + backPosY
      createdBlock.css("background-position", backPos)
      var check = numBlocks + 1
      createdBlock.attr("id", pegNum[i].id)
      if (first < numBlocks) {
        createdBlock.css("display", "none")
        first++
      }else{
        createdBlock.css("display", "")
      }
      $("#peg" + num).append(createdBlock)
    }
  },

  checkIfWin(){
    if (this.peg1[0] == null && (this.peg2[0] == null || this.peg3[0] == null)) {
      user.win()
    }
  }
}

//Block class is created for as many stones as are selected.  createBlock creates
//a div and places it on the board.  colorX and colorY create a random number
//between 1 and 100.  These two properties will then be used to randomly offset
//the 'background-position' of the large stone texture on each stone.
class Block{
  constructor(size, id){
    this.size = size
    this.colorX = Math.floor((Math.random() * 100) + 1)
    this.colorY = Math.floor((Math.random() * 100) + 1)
    this.id = "block" + id
  }

  createBlock(i) {
    var width = this.size * 10 + 10
    var createdBlock = $("<div></div>")
    createdBlock.addClass("block")
    createdBlock.css("width", width)
    createdBlock.attr("id","block" + i)
  }
}

//Function to determin number of stones when the game is started
function createStartBoard(numBlocks=4){
  numBlocks++
  for (var i = 1; i < numBlocks; i++) {
    var newBlock = new Block(i, i)
    tower.peg1.unshift(newBlock)
  }
}

//Function to create option values for number of blocks selector
function createOptionValues() {
  for (var i = 3; i < 11; i++) {
    var newOption = $("<option></option>")
    newOption.attr("value",i)
    newOption.text(i)
    $("select").append(newOption)
  }
  numBlocksSelector.val('4')

}

//Function for the first click of a platform.  Turns off this platforms ability
//to be clicked and turns on ability to click second platform.
function clickedPeg(){
  removeAnimation()
  pegClick1 = this.id
  if (tower[pegClick1][0] != null) {
    tower.click1 = this.id
    $(this).children().first().addClass("clickedPeg")
    peg.off("click")
    peg.on("click", secondClickedPeg)
    $(this).off("click")
  }
}

//Removes the class "animate" so stones don't animate falling on every move.
function removeAnimation(){
  for (var i = 0; i < tower.peg1.length; i++) {
    var blockId = "#" + tower.peg1[i].id
    $(blockId).removeClass("animate")
  }
}

//Function for when the second platform is clicked.  Turns back on ability to
//click first platform.
function secondClickedPeg(){
  pegClick2 = this.id
  tower.click2 = pegClick2
  peg.removeClass("clickedPeg")
  peg.off("click",secondClickedPeg)
  peg.on("click", clickedPeg)
  tower.move(tower[pegClick1],tower[pegClick2])
  displayTower()
}

//Functions to animate the stones so they fall in a cascading fashion.
//Loops through each stone at the start of the game, removes the display of
//'none' and spaces out the animation duration by 75ms each.
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



//Sets the display of the stones to 'none' right as the game starts so they can
//fall from the top to their landing position
function turnDisplayOff(){
  for (var i = 0; i < tower.peg1.length; i++) {
    var blockId = "#" + tower.peg1[i].id
    $(blockId).css("display", "none")
  }
}

//Starts the timer on the first click of a peg and turns this listener off
function startTimerOnClick(){
  user.startTimer()
  peg.off("click", startTimerOnClick)
}

//Wood texture is a large picture.  This function randomizes the 'background-position'
//of the texture in each stand and base so they all appear different and random.
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

//Turns the infoWindow on and off on a click.
function displayInfoWindow(){
  // $(".infoWindow").css("display", "unset")
  $(".infoWindow").toggleClass("displayToggle")
  // $("#createdBy").toggleClass("displayToggle")
  // $("#newGame").toggleClass("displayToggle")
  // $("#newGameStart").css("display", "unset")
  // $("#newGameStart").on("click",startGame)
}





function displayTower(){
  console.log("peg1 : " + tower.peg1)
  console.log("peg2 : " + tower.peg2)
  console.log("peg3 : " + tower.peg3)
}
