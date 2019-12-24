var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","hit");
  },
  displayMiss: function(location) {
    var cell =document.getElementById(location);
    cell.setAttribute("class","miss")
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  fire: function(guess) {

    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];

      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        if (this.isSunk(ship)) {
          view.displayHit(guess);
          view.displayMessage("HIT!");
          if (this.isSunk(ship)) {
            view.displayMessage("you sank my battleship!");
            this.shipsSunk++;
          }
            return true;
        }

      }
      view.displayMiss(guess);
      view.displayMessage("you missed.");
        return false;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction ===1) {
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() *(this.boardSize - this.shipLength));
    }  else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
      return newShipLocations;
    }

  },
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do{
          locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },
  ships: [{locations: ["0", "0","0"],  hits: ["","",""] },
          {locations: ["0", "0","0"],  hits: ["","",""] },
          {locations: ["0", "0","0"],  hits: ["","",""] }],

  isSunk: function(ship) {
    for (var i = 0; i < this.shipslength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  }
};

var controller = {
  guesses: 0,

  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
          view.displayMessage("you sank all my battleships, in " + this.guesses + " guesses");
        }
      }
    }
  };


function parseGuess(guess) {
    var alphabet = ["A","B","C","D","E","F","G"];

    if (guess === null || guess.length !== 2) {
      alert("oops, please enter a letter and a number on the board.");
    } else {
      firstChar = guess.charAt(0);
      var row = alphabet.indexOf(firstChar);
      var column = guess.charAt(1);

      if (isNaN(row) || isNaN(column)) {
        alert("oops, that isn't on the board.");
      } else if (row < 0 || row >= model.boardSize || column >= model.boardSize) {
        alert("oops, that's off the board")
      } else {
        return row + column;
      }
    }
  };

  function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFirebutton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeypress;

    model.generateShipLocations();
  }

  function handleKeypress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
      fireButton.click();
      return false;
    }
  }

  function handleFirebutton() {
    var guessInput = document.getElementById("guessInput")
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value ="";
  };

  window.onload = init;
