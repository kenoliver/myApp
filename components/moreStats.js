import { getAllStatsByLeg } from "../services/statistics";

import React, { Component } from "react";
import Flag from "react-native-flags";
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  ScrollView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import HeaderButton from "./headerButton";

export class MoreStats extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    match: null,
    matchStats: null,
    playerStats: null,
    title: null
  };

  statTitles = [
    "3 DARTS AVG",
    "9 DARTS AVG",
    "DOUBLES SUCCESS %",
    "60+",
    "100+",
    "140+",
    "180s",
    "HI CHECK-OUT",
    "BEST LEG",
    "WORST LEG",
    "AVG LEG"
  ];

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <HeaderButton title="GAME" onPress={()=>navigation.goBack(navigation.getParam("backKey"))} />
    ),
    headerLeft:(
      <HeaderButton title="BACK" onPress={()=>navigation.goBack(null)} />
    ) 
  });

  componentWillMount() {
    const { navigation } = this.props;
    let match = navigation.getParam("match", null);
    let title = navigation.getParam("title", null);
    const matchStats = match.allPlayerStats();
    let playerStats = getAllStatsByLeg(
      match.matchData.scores,
      match.matchData.players[0].id,
      match.matchData.players[1].id
    );
    this.setState({ match: match, matchStats:matchStats,playerStats: playerStats, title: title });
  }
  componentDidMount() {}

  renderStatRow(row) {
    var player1;
    var player2;
    switch (this.state.title) {
      case "3 DARTS AVG":
        player1 = row.averages[0].toFixed(2);
        player2 = row.averages[1].toFixed(2);
        break;
      case "9 DARTS AVG":
        player1 = row.averages9[0].toFixed(2);
        player2 = row.averages9[1].toFixed(2);
        break;
      case "DOUBLES SUCCESS %":
        player1 = row.doubles[0].formatted;
        player2 = row.doubles[1].formatted;
        break;
      case "60+":
        player1 = row.highScores[0].sixty;
        player2 = row.highScores[1].sixty;
        break;
      case "100+":
        player1 = row.highScores[0].tonne80;
        player2 = row.highScores[1].tonne;
        break;
      case "140+":
        player1 = row.highScores[0].tonne40;
        player2 = row.highScores[1].tonne40;
        break;
      case "180s":
        player1 = row.highScores[0].tonne80;
        player2 = row.highScores[1].tonne80;
        break;
      case "HI CHECK-OUT":
        player1 = row.checkouts[0];
        player2 = row.checkouts[1];
        break;
      case "BEST LEG":
        player1 = row.bestlegs[0];
        player2 = row.bestlegs[1];
        break;
      case "WORST LEG":
        player1 = row.bestlegs[0];
        player2 = row.bestlegs[1];
        break;
      case "AVG LEG":
        player1 = row.bestlegs[0];
        player2 = row.bestlegs[1];
        break;
      default:
    }
    return (
      <View style={styles.top}>
        <View style={styles.statRow}>
          <View style={styles.statNumberBox}>
            <Text style={styles.statNumberText}>{player1}</Text>
          </View>

          <TouchableHighlight style={styles.statTitleBox}  onPress={() => {
              let match = this.state.match;
              this.props.navigation.navigate("ViewLegs", { match: match, leg:row.leg, backKey: this.props.navigation.getParam("backKey")});
            }}>
            <View >
              <Text style={styles.statTitleText}>LEG-{row.leg}
              </Text>
            </View>
          </TouchableHighlight>

          <View style={styles.statNumberBox}>
            <Text style={styles.statNumberText}>{player2}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.main}>
       
      

        <View style={styles.top}>
          <View style={styles.playerRow}>
            <View style={styles.playerBox}>
              <Flag
                code={this.state.match.matchData.players[0].flag}
                size={32}
                type="flat"
              />
              <Text style={styles.playerText}>
                {this.state.match.matchData.players[0].name}
              </Text>
            </View>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{this.state.matchStats[0].checkouts.length} -{" "}
                {this.state.matchStats[1].checkouts.length}</Text>
            </View>

            <View style={styles.playerBox}>
              <Flag
                code={this.state.match.matchData.players[1].flag}
                size={32}
                type="flat"
              />
              <Text style={styles.playerText}>
                {this.state.match.matchData.players[1].name}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{this.state.title}</Text>
        </View>
        <ScrollView>
          {this.state.playerStats.map((row, index) => {
            return <View key={row}>{this.renderStatRow(row)}</View>;
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#262626",
    padding: 5,
    flex: 1
  },

  menu: {
    height: 20
  },
  menuText: {
    color: "white",
    fontSize: wp("2%"),
    lineHeight: wp("2.2%")
  },
  playerRow: {
    flexDirection: "row",
    marginLeft: 1,
    height: hp("7%")
  },
  playerBox: {
    flex: 3,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 1,
    borderColor: "#d9d9d9",
    borderWidth: 1
  },
  playerText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("5%"),
    fontFamily: "normal"
  },
  scoreBox: {
    flex: 1.4
    ,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center"
  },
  scoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("3.8%")
  },
  banner: {
    height: wp("7%"),
    alignItems: "center",
    borderColor: "#404040",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  bannerText: {
    color: "white",
    fontSize: wp("3%"),
    fontWeight: "700",
    lineHeight: wp("4.5%"),
    alignSelf: "center"
  },

  statRow: {
    flexDirection: "row",
    marginLeft: 1,
    marginBottom: 2,
    height: hp("6%")
  },
  statNumberBox: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 1
  },
  statTitleBox: {
    flex: 4.0,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 1,
    borderColor: "#d9d9d9",
    borderWidth: 1
  },
  statNumberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("3.8%"),
    fontFamily: "normal"
  },
  statTitleText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "normal"
  }
});

export default MoreStats;
