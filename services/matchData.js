

export class MatchData {
  constructor() {
    this.id = new Date().getTime();
    this.date = new Date();
    this.gameType = "X01";
    this.startCount = 180;
    this.venue = "";
    this.division = "";
    this.gameTitle = "";
    this.numberOfLegs = 3;
    this.players = [
      { name: "Bob", order: 2, index: 0, id: "player-1", flag: "england" },
      { name: "Steve", order: 1, index: 1, id: "player-2", flag: "NR" }
    ];
    this.scores = [];
    this.complete = false
  } 
}
