document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".game-card");
  let numCards = cards.length;
  let card1 = null;
  let card2 = null;
  let cardsFlipped = 0;
  let currentScore = 0;
  let lowScore = localStorage.getItem("low-score");
  let start = document.getElementById("start");

  if (lowScore) {
    document.getElementById("best-score").innerText = lowScore;
  }

  for (let card of cards) {
    card.addEventListener("click", handleCardClick);
  }

  let startBtn = document.getElementById("start-button");
  startBtn.addEventListener("click", startGame);
  /**
   * Function handles the click event when player clicks on a card. 
   *  
   */
  function handleCardClick(e) {
    // Checks if card has been flipped.
    if (!e.target.classList.contains("front")) return;

    // If card has not been flipped, set the card to currentCard variable.
    let currentCard = e.target.parentElement;

    /** If card 1 or card 2 is not set yet, check if currentCard is not already flipped. 
        If it's not, increment the store by 1 with setSecore function. */

    if (!card1 || !card2) {
      if (!currentCard.classList.contains("flipped")) {
        setScore(currentScore + 1);
      }
      /**
       * currentCard is flipped with "flipped" class.
       * If card1 is not set, assign card 1 = currentCard. Else, if card 2 = currentCard.
       */
      currentCard.classList.add("flipped");
      card1 = card1 || currentCard;
      card2 = currentCard === card1 ? null : currentCard;
    }

    /**
     * If both card1 and card2 are set (player chose two cards) --> check if two cards are same by image src. 
     * 
     * If two cards are same the card --> remove event listener for clicks and setting card1 and card2 to null. 
     * Else, if they are not same -->  card flipped back, remove"flipped" class after 1000ms, reset card1 and card2.
     */

    if (card1 && card2) {
      let gif1 = card1.children[1].children[0].src;
      let gif2 = card2.children[1].children[0].src;

      if (gif1 === gif2) {
        cardsFlipped += 2;
        card1.removeEventListener("click", handleCardClick);
        card2.removeEventListener("click", handleCardClick);
        card1 = null;
        card2 = null;
      } else {
        setTimeout(function () {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          card1 = null;
          card2 = null;
        }, 1000);
      }
    }

    //checks cards flipped === number of cards, used all of the cards
    if (cardsFlipped === numCards) endGame();
  }

  /**
   * Function initalize the start of the game.
   * Set score to 0.
   * Remove start button.
   * Create an indicies array, with values from 1 to half of the total num of cards.
   * 
   */
  function startGame() {
    setScore(0);
    start.classList.add("playing");
    let indices = [];
    for (let i = 1; i <= numCards / 2; i++) {
      indices.push(i.toString());
    }

    //indices array is concatenated with itself using the concat method to create pairs of indices then shuffled.
    let pairs = shuffle(indices.concat(indices));

    /**
     * Loops through the cards array and assigns each card a GIF from the shuffled pairs array. 
     * Path variable is set file path of the corresponding GIF, 
     * and src attribute of the child img element of the current card is set to path.
     */
    for (let i = 0; i < cards.length; i++) {
      let path = "gifs/" + pairs[i] + ".gif";
      cards[i].children[1].children[0].src = path;
    }
  }

  /**
   * Function shuffles the element of an array in random order and returns a new shuffled array.
   * 
   * Credit -- Fisher-Yates shuffle algorithm
   */
  function shuffle(array) {
    //slice avoids modifying original array.
    let arrayCopy = array.slice();
    //Iterate from last index, swapping each element with another randomly chosen element.
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      // generate a random index between 0 and idx1 (inclusive)
      let idx2 = Math.floor(Math.random() * (idx1 + 1));

      // swap elements at idx1 and idx2
      let temp = arrayCopy[idx1];
      arrayCopy[idx1] = arrayCopy[idx2];
      arrayCopy[idx2] = temp;
    }
    return arrayCopy;
  }

  /**
   * Function updates current score to new score value. 
   */
  function setScore(newScore) {
    currentScore = newScore;
    document.getElementById("current-score").innerText = currentScore;
  }


  /**
   * Function called when game ends.
   * 
   * Update game board to reflect final score of the player.
   */
  function endGame() {

    //Display the end of the game message and the player's final score.
    let end = document.getElementById("end");
    let scoreHeader = end.children[1];
    scoreHeader.innerText = "Your score: " + currentScore;

    /**Checks if the currentScore is less than the lowest score saved in the browser's localStorage.
     *If it is, then the scoreHeader element is updated to include a msg that the player has achieved a new best score, 
    *and the new score is saved in the localStorage using localStorage.setItem(). */
    let lowScore = +localStorage.getItem("low-score") || Infinity;
    if (currentScore < lowScore) {
      scoreHeader.innerText += " - NEW BEST SCORE!!";
      localStorage.setItem("low-score", currentScore);
    }
    document.getElementById("end").classList.add("game-over");
  }
});
