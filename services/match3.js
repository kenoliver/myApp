import { AddRow } from "./addRow";

export class Match3 {
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
  }

  addPlayer(name, order, flag) {
    var number = this.players.length + 1;
    var id = "player-" + number;
    var index = order - 1;
    var p = new player(name, order, index, id, flag);
    this.players.push(p);
  }

  playerIndex(playerid) {
    const player = this.players.map(e => e.id).indexOf(playerid);
    return this.players[player].index;
  }
  playerName(playerid) {
    const player = this.players.map(e => e.id).indexOf(playerid);
    return this.players[player].name;
  }

  getLeg() {
    var leg = 1;
    var scores = this.scores;
    if (!scores.length == 0) {
      var legs = [];

      scores.forEach(function(score) {
        if (legs.indexOf(score.leg) === -1) {
          legs.push(score.leg);
        }
      });

      legs.sort(function(a, b) {
        return a - b;
      });

      leg = legs[legs.length - 1];

      leg = this.searchFinish(leg) ? leg + 1 : leg;
    }
    return leg;
  }

  getLegsPlayed(){
    var legs = [];
    this.scores.forEach(function(score) {
      if (legs.indexOf(score.leg) === -1) {
        legs.push(score.leg);
      }
    });
    return legs.length
  }

  searchFinish(leg) {
    var finished = false;
    var scores = this.scores;
    if (!scores.length == 0) {
      scores.forEach(function(score) {
        if (score.leg == leg) {
          if (score.finished == true) {
            finished = true;
          }
        }
      });
    }
    return finished;
  }

  getVisit(leg, player) {
    var visit = 1;
    var scores = this.scores;
    if (!scores.length == 0) {
      visit = 0;
      scores.forEach(function(score) {
        if (score.leg == leg && score.player == player) {
          if (score.visit > visit) {
            visit = score.visit;
          }
        }
      });
      visit += 1;
    }
    return visit;
  }

  getThrower(next) {
    var leg = this.getLeg();

    var visit1 = this.getVisit(leg, this.players[0].id);
    var visit2 = this.getVisit(leg, this.players[1].id);
    var order1 = this.players[0].order;
    var order2 = this.players[1].order;

    var visit;

    var playerid;
    var otherid;
    if (visit1 > visit2) {
      playerid = "player-2";
      otherid = "player-1";
      visit = visit2;
    } else if (visit2 > visit1) {
      playerid = "player-1";
      otherid = "player-2";
      visit = visit1;
    } else {
      playerid = leg % 2 == 1 ? "player-1" : "player-2";
      playerid =
        leg % 2 == 1
          ? order1 == 1
            ? "player-1"
            : "player-2"
          : order1 == 1
            ? "player-2"
            : "player-1";
      otherid = playerid == "player-1" ? "player-2" : "player-1";
      visit = visit1;
    }

    return next ? playerid : otherid;
  }

  getNewState(leg) {
    if (!leg){
        var leg = this.getLeg();
    }
  
    var visitRows = [];
    var visits = [0, 0];
    var wins = [0, 0];
    var remainings = [0, 0];
    var allScores = this.scores;
    var startCount = this.startCount;
    this.players.forEach(function(player) {
      var totalScore = 0;
      var lastTotal = 0;
      var remaining = startCount;
      var totalWins = 0;
      var lastVisit = 0;
      allScores.forEach(function(score) {
        if (score.player == player.id && score.leg == leg) {
          totalScore += score.score;
          remaining = startCount - totalScore;

          if (score.visit > visitRows.length) {
            visitRows.push(new AddRow(score.visit));
          }

          visitRows[score.visit - 1].players[
            player.index
          ].remaining = remaining;
          visitRows[score.visit - 1].players[player.index].score = score.score;
          lastVisit = score.visit;
        } else if (score.player == player.id && score.finished == true) {
          totalWins++;
        }
      });

      remainings[player.index] = remaining;
      wins[player.index] = totalWins;
      visits[player.index] = lastVisit;
    });
    if (visits[0] == visits[1]) {
      visitRows.push(new AddRow(visits[0] + 1));
    }
  
    return { visitRows: visitRows, wins: wins, remainings: remainings };
  }

  isBust(score, player, leg) {
    var bust = false;
    var totalScore = parseFloat(score);
    var startCount = this.startCount;
    this.scores.forEach(function(score) {
      if (score.player == player && score.leg == leg) {
        totalScore += parseFloat(score.score);
      }
    });
    var remaining = startCount - totalScore;
    bust = remaining < 2 && remaining != 0 ? true : false;

    return bust;
  }

  checkFinished(score, player, leg) {
    var finished = false;
    var totalScore = parseFloat(score);
    var startCount = this.startCount;
    totalScore += this.getTotalScore(player, leg);
    var remaining = startCount - totalScore;
    finished = remaining == 0 ? true : false;
    return finished;
  }
  showDoubles(score, player, leg) {
    var show = false;
    var start = this.startCount;
    var last = start - this.getTotalScore(player, leg);
   
    var remaining = last - score;
    if ((last < 161 || last ==164 || last ==167 || last ==170) && remaining < 41 && remaining > -1 && remaining !== 1) {
      show = true;
    }
    if ((last < 161 || last ==164 || last ==167 || last ==170) && score == 0) {
      show = true;
    }
    return show;
  }

  getTotalScore(player, leg) {
    var totalScore = 0;
    this.scores.forEach(function(score) {
      if (score.player == player && score.leg == leg) {
        totalScore += parseFloat(score.score);
      }
    });
    return totalScore;
  }
 

  getStats(player) {
   
    let obj = {
      avg: 0,
      avg9: 0,
      doubles: 0,
      doublesString: "",
      sixty: 0,
      tonne: 0,
      tonne40: 0,
      tonne80: 0,
      checkouts: [],
      bestlegs: [],
      missedDoubles: 0,
      avgBestLeg: 0,
     
    };
    var totalscore = 0;
    var totalscoreFirstNine = 0;
    var totalDarts = 0;
    var totalDartsFirstNine = 0;
    var missedDoubles = 0;
    var totalFinishes = 0;
    var checkouts = [];
    var bestlegs = [];

    var legs = [];
    this.scores.forEach(function(score) {
      if (legs.indexOf(score.leg) === -1) {
        legs.push(score.leg);
      }
    });
   

    this.scores.forEach(function(score) {
      if (score.player == player) {
       
        var scored = parseFloat(score.score);
        totalscore += scored;
        totalscoreFirstNine += score.visit < 4 ? scored : 0;
        totalDarts += score.dartsThrown;
        totalDartsFirstNine += score.visit < 4 ? 3 : 0;
        missedDoubles += score.missedDoubles;
        obj.sixty = scored > 59 && scored < 100 ? obj.sixty + 1 : obj.sixty;
        obj.tonne = scored > 99 && scored < 140 ? obj.tonne + 1 : obj.tonne;
        obj.tonne40 =
          scored > 139 && scored < 180 ? obj.tonne40 + 1 : obj.tonne40;
        obj.tonne80 = scored == 180 ? obj.tonne80 + 1 : obj.tonne80;
        if (score.finished) {
          totalFinishes += 1;
          checkouts.push(scored);
          bestlegs.push(score.visit * 3 - 3 + score.dartsThrown);
        }
      }
    });

    obj.avg = totalDarts == 0 ? 0 : (totalscore / totalDarts) * 3;
    obj.avg9 =
      totalDartsFirstNine == 0
        ? 0
        : (totalscoreFirstNine / totalDartsFirstNine) * 3;
    obj.missedDoubles = missedDoubles;
    obj.doubles =
      missedDoubles + totalFinishes == 0
        ? 0
        : (totalFinishes / (missedDoubles + totalFinishes)) * 100;
    obj.doublesString =
      checkouts.length +
      "/" +
      (missedDoubles + checkouts.length) +
      " (" +
      obj.doubles.toFixed(0) +
      "%)";
    obj.checkouts = checkouts.sort(function(a, b) {
      return b - a;
    });
    obj.bestlegs = bestlegs.sort(function(a, b) {
      return a - b;
    });
    var sum =
      obj.bestlegs.length == 0
        ? 0
        : obj.bestlegs.reduce(function(a, b) {
            return a + b;
          });
    var numlegs = bestlegs.length;
    obj.avgBestLeg = numlegs == 0 ? 0 : sum / numlegs;
     
    return obj;
  }

  allPlayerStats() {
    var obj = [];
   
    var p1 = this.getStats(this.players[0].id)
    obj.push(p1)
    var p2 = this.getStats(this.players[1].id)
    obj.push(p2)
   
    return obj;
  }
}
