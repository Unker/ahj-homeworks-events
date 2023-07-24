export default class GameController {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this._dead = 0;
    this._lost = 0;
    this.activeHole = -1;
    this.gameOver = true;
    this.timeActiveHole = 1000;
  }

  init() {
    this.onCellClick = this.onCellClick.bind(this);
    this.gamePlay.addCellClickListener(this.onCellClick);

    this._dead = 0;
    this._lost = 0;
    this.gameOver = false;

    this.gamePlay.drawUi();

    this.runMainTimer(this.timeActiveHole);
    this.runInterfaceTimer(100);
  }

  runMainTimer(time) {
    this._mainTimer = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this._mainTimer);
      } else {
        if (this._lost >= 5) {
          this.endGame();
        } else {
          this.setRandomActiveHole();
        }
        this._lost += 1; // пропущенный крот идет в поражение
      }
    }, time);
  }

  runInterfaceTimer(time) {
    const interfaceTimer = setInterval(() => {
      if (this.gameOver) {
        clearInterval(interfaceTimer);
      } else {
        this.gamePlay.updateCurrentScore(this._dead, this._lost);
      }
    }, time);
  }

  setRandomActiveHole() {
    this.gamePlay.deactivateHole(this.activeHole);
    let newActiveHole = this.activeHole;
    while (newActiveHole === this.activeHole) {
      newActiveHole = Math.floor(Math.random() * this.gamePlay.boardSize ** 2);
    }
    this.activeHole = newActiveHole;
    this.gamePlay.activateHole(this.activeHole);
  }

  onCellClick(index) {
    if (this.gamePlay.isActiveHole(index)) {
      this._dead += 1;
    } else {
      this._lost += 1;
    }
    clearInterval(this._mainTimer);
    this.runMainTimer(this.timeActiveHole);
    this.setRandomActiveHole();
  }

  endGame() {
    this.gameOver = true;
    clearInterval(this._mainTimer);
    this.gamePlay.removeCellClickListener(this.onCellClick);
    this.gamePlay.displayGameOver();
  }
}
