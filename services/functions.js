export function calculateLeg() {
    var leg = 1;
    var scores = match.scores;
    if (!scores.length == 0) {


            var legs = [];

            scores.forEach(function (score) {

                    if (legs.indexOf(score.leg) === -1) {
                            legs.push(score.leg);
                    }
            });


            legs.sort(function (a, b) {
                    return a - b
            });

            leg = legs[legs.length - 1];

            leg = searchFinish(leg,match) ? leg + 1 : leg
    }
    return leg
}

export function searchFinish(leg) {
    var finished = false;
    var scores = match.scores;
    if (!scores.length == 0) {
            scores.forEach(function (score) {
                    if (score.leg == leg) {
                            if (score.finished == true) {
                                    finished = true
                            }
                    }
            })
    }
    return finished
}

export function calculateVisit(leg, player) {
    var visit = 1;
    var scores = match.scores;
    if (!scores.length == 0) {
            visit = 0
            scores.forEach(function (score) {
                    if (score.leg == leg && score.player ==
                            player) {
                            if (score.visit > visit) {
                                    visit = score.visit
                            }
                    }
            })
            visit += 1
    }
    return visit
}

export function getThrower(next) {
    
    var leg = calculateLeg();
    
    var visit1 = calculateVisit(leg, match.players[0].name);
    var visit2 = calculateVisit(leg, match.players[1].name);
    var order1 = match.players[0].order;
    var order2 = match.players[1].order;

    var visit

    var playerid
    var otherid
    if (visit1 > visit2) {
            playerid = ".player-2"
            otherid = ".player-1"
            visit = visit2
    } else if (visit2 > visit1) {
            playerid = ".player-1"
            otherid = ".player-2"
            visit = visit1
    } else {
            playerid = (leg % 2 == 1) ? ".player-1" : ".player-2";
            playerid = (leg % 2 == 1) ? (order1 == 1 ? ".player-1" :
                    ".player-2") : (order1 == 1 ? ".player-2" :
                    ".player-1")
            otherid = playerid == ".player-1" ? ".player-2" : ".player-1";
            visit = visit1
    }

    return next ? playerid : otherid

}
