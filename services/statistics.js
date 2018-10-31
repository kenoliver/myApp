
export function averageByLeg(player, leg, scores) {
  let totalScore = 0;
  let dartsThrown = 0;
  let avg = 0;
  scores.forEach(function(score) {
    if (score.player == player && score.leg == leg) {
      dartsThrown += score.dartsThrown;
      totalScore += score.score;
    }
  });
  avg = dartsThrown == 0 ? 0 : (totalScore * 3) / dartsThrown;
  return avg;
}

export function averageNineByLeg(player, leg, scores) {
    let totalScore = 0;
    let dartsThrown = 0;
    let avg = 0;
    scores.forEach(function(score) {
      if (score.player == player && score.leg == leg && score.visit <4) {
        dartsThrown += score.dartsThrown;
        totalScore += score.score;
      }
    });
    avg = dartsThrown == 0 ? 0 : (totalScore * 3) / dartsThrown;
    return avg;
  }

  export function doublesByLeg(player, leg, scores){
      let obj ={
          missedDoubles:0,
          success:0,
          doublesThrown:0,
          percent:0,
          formatted:""
      }
      scores.forEach(function(score) {
        if (score.player == player && score.leg == leg) {
          obj.missedDoubles += score.missedDoubles;
          obj.success = score.finished ? obj.success +1: obj.success
        }
      });
       obj.doublesThrown = obj.missedDoubles + obj.success
      let percent =obj.doublesThrown !=0? obj.success/obj.doublesThrown *100 :0
      obj.percent = percent.toFixed(0)
      obj.formatted = obj.success +"/" +obj.doublesThrown + " (" +obj.percent + "%)"
      return obj
  }

  export function highScoresByLeg(player, leg, scores){
        let obj ={
            sixty:0,
            tonne:0,
            tonne40:0,
            tonne80:0,
        }
        scores.forEach(function(score) {
            if (score.player == player && score.leg == leg ) {
                obj.sixty = score.score > 59 && score.score < 100 ? obj.sixty + 1 : obj.sixty;
                obj.tonne = score.score > 99 && score.score < 140 ? obj.tonne + 1 : obj.tonne;
                obj.tonne40 = score.score > 139 && score.score < 180 ? obj.tonne40 + 1 : obj.tonne40;
                obj.tonne80 = score.score == 180 ? obj.tonne80 + 1 : obj.tonne80;
            }
          });
          return obj
  }
  export function checkoutByLeg(player, leg, scores){
    let checkout=""
    scores.forEach(function(score) {
        if (score.player == player && score.leg == leg && score.finished ==true ) {
           checkout = score.score
        }
      });
    return checkout
  }

  export function bestlegByLeg(player, leg, scores){
    let bestleg=""
    scores.forEach(function(score) {
        if (score.player == player && score.leg == leg && score.finished ==true ) {
           bestleg = score.visit *3 -3 + score.dartsThrown
        }
      });
    return bestleg
  }


  export function getAllStatsByLeg(scores,player1,player2,leg){
      let legs =[]
      if (leg){
        legs.push(leg)
      }else{
        scores.forEach(function(score) {
        if (legs.indexOf(score.leg) === -1) {
          legs.push(score.leg);
        }
      });
      }
      
      var allStats=[]
      legs.forEach(function(leg){
          var obj ={}
          obj.leg=leg
          obj.averages=[]

          var avg1 =averageByLeg(player1,leg,scores)
          var avg2 =averageByLeg(player2,leg,scores)
          obj.averages.push(avg1)
          obj.averages.push(avg2)

          obj.averages9 =[]
          var avgnine1 =averageNineByLeg(player1,leg,scores)
          var avgnine2 =averageNineByLeg(player2,leg,scores)
          obj.averages9.push(avgnine1)
          obj.averages9.push(avgnine2)

          obj.doubles =[]
          var doubles1 =doublesByLeg(player1,leg,scores) 
          var doubles2 =doublesByLeg(player2,leg,scores) 
          obj.doubles.push(doubles1)
          obj.doubles.push(doubles2)

          obj.highScores =[]
          var highScores1 =highScoresByLeg(player1,leg,scores) 
          var highScores2 =highScoresByLeg(player2,leg,scores) 
          obj.highScores.push(highScores1)
          obj.highScores.push(highScores2)

          obj.checkouts =[]
          var checkouts1 =checkoutByLeg(player1,leg,scores) 
          var checkouts2 =checkoutByLeg(player2,leg,scores) 
          obj.checkouts.push(checkouts1)
          obj.checkouts.push(checkouts2)

          obj.bestlegs =[]
          var bestlegs1 =bestlegByLeg(player1,leg,scores) 
          var bestlegs2 =bestlegByLeg(player2,leg,scores) 
          obj.bestlegs.push(bestlegs1)
          obj.bestlegs.push(bestlegs2)

          allStats.push(obj)
      })
       
      return allStats
  }
