import {
  getAllStatsByLeg,
  avergageByLeg,
  averageNineByLeg,
  doublesByLeg,
  highScoresByLeg
} from "../services/statistics";

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

export class ViewLegs extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    match: null,
    matchStats: null,
    playerStats: null,
    rows: null,
    leg: null,
    legs: 10
  };

  statTitles = [
    "3 DARTS AVG",
    "9 DARTS AVG",
    "DOUBLES SUCCESS %",
    "60+",
    "100+",
    "140+",
    "180s"
  ];

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <View>
      </View>
    ),
  });

  componentWillMount() {
    const { navigation } = this.props;
    let match = navigation.getParam("match", null);
    const matchStats = match.allPlayerStats();
    let leg = navigation.getParam("leg", null);
    let playerStats = getAllStatsByLeg(
      match.matchData.scores,
      match.matchData.players[0].id,
      match.matchData.players[1].id,
      leg
    );
    let legs = match.getLegsPlayed();
    var obj = match.getNewState(leg);

    this.setState({
      match: match,
      matchStats: matchStats,
      playerStats: playerStats,
      rows: obj.visitRows,
      leg: leg,
      legs: legs
    });
  }
  componentDidMount() {}
  renderStatRow = title => {
    var row = this.state.playerStats[0];
    var player1;
    var player2;
    switch (title) {
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

      default:
    }
    return (
      <View style={styles.top}>
        <View style={styles.statRow}>
          <View style={styles.statNumberBox}>
            <Text style={styles.statNumberText}>{player1}</Text>
          </View>

          <TouchableHighlight
            style={styles.statTitleBox}
            onPress={() => {
              let match = this.state.match;
              this.props.navigation.navigate("MoreStats", {
                match: match,
                title: title
              });
            }}
          >
            <View>
              <Text style={styles.statTitleText}>{title}</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.statNumberBox}>
            <Text style={styles.statNumberText}>{player2}</Text>
          </View>
        </View>
      </View>
    );
  };

  renderPageButtons = () => {
    let pages = [];
    for (i = 1; i < this.state.legs + 1; i++) {
      const leg = i;
      const boxStyle =
        this.state.leg == i ? styles.pageButtonHighlight : styles.pageButton;
      const fontColor = this.state.leg == i ? "#404040" : "#dddddd";
      pages.push(
        <TouchableHighlight
          key={i}
          style={boxStyle}
          onPress={() => {
            let obj = this.state.match.getNewState(leg);
            let rows = obj.visitRows;
            let playerStats = getAllStatsByLeg(
              this.state.match.matchData.scores,
              this.state.match.matchData.players[0].id,
              this.state.match.matchData.players[1].id,
              leg
            );

            this.setState({ leg: leg, rows: rows, playerStats: playerStats });
          }}
        >
          <Text style={{ color: fontColor, textAlign: "center" }}>{i}</Text>
        </TouchableHighlight>
      );
    }
    return pages;
  };

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
              <Text style={styles.scoreText}>
                {this.state.matchStats[0].checkouts.length} -{" "}
                {this.state.matchStats[1].checkouts.length}
              </Text>
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
          <Text style={styles.bannerText}>
            LEG-
            {this.state.leg}
          </Text>
        </View>
        <View style={styles.pagination}>
          <ScrollView
            horizontal={true}
            vertical={false}
            style={styles.pageScroll}
          >
            {this.renderPageButtons()}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.allScores}
          ref={ref => (this.scrollView = ref)}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd({ animated: true });
          }}
        >
          {this.state.rows.map((row, index) => {
            return (
              <View key={index} style={styles.allScoresRow}>
                <View style={styles.allScoresBox3}>
                  <Text style={styles.allScoresText3}>
                    {row.players[0].remaining}
                  </Text>
                </View>
                <View style={styles.allScoresBox2}>
                  <Text style={styles.allScoresText2}>
                    {this.state.rows[index].players[0].score}
                  </Text>
                </View>
                <View style={styles.allScoresBox1}>
                  <Text style={styles.allScoresText1}>{row.visit * 3}</Text>
                </View>
                <View style={styles.allScoresBox2}>
                  <Text style={styles.allScoresText2}>
                    {this.state.rows[index].players[1].score}
                  </Text>
                </View>
                <View style={styles.allScoresBox3}>
                  <Text style={styles.allScoresText3}>
                    {row.players[1].remaining}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.bottom}>
          {this.statTitles.map((row, index) => {
            return <View key={row}>{this.renderStatRow(row)}</View>;
          })}
        </View>
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
    flex: 1,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center"
  },
  scoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("5%")
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
    height: hp("4%")
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
    flex: 4.5,
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
    fontSize: wp("3%"),
    fontFamily: "normal"
  },
  statTitleText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("3%"),
    fontFamily: "normal"
  },
  allScoresRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 1,
    height: hp("5%")
  },
  allScores: {
    flex: 1
  },

  allScoresBox3: {
    flex: 3,
    flexDirection: "row",

    backgroundColor: "white",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginRight: 1
  },
  allScoresBox2: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginRight: 1
  },
  allScoresBoxHighlight: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "yellow",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginRight: 1
  },
  allScoresBox1: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#bfbfbf",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginRight: 1
  },
  allScoresText3: {
    flex: 1,

    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("7%"),
    fontFamily: "Calibri",
    textAlign: "center",
    alignSelf: "center"
  },
  allScoresText2: {
    flex: 1,

    color: "#404040",

    fontSize: wp("5%"),
    fontFamily: "Calibri",
    textAlign: "center",

    alignSelf: "center"
  },

  allScoresText1: {
    flex: 1,

    color: "#404040",

    fontSize: wp("4%"),
    fontFamily: "Calibri",
    textAlign: "center",
    alignSelf: "center"
  },
  bottom: {
    flex: 1,
    borderTopColor: "#404040",
    borderTopWidth: 2,
    paddingTop: 5,

    justifyContent: "center"
  },
  pagination: {
    height: wp("15%"),
    alignItems: "center",
    justifyContent: "center"
  },
  pageScroll: {
    height: wp("6%")
  },

  pageButton: {
    height: wp("6%"),
    width: wp("6%"),
    margin: 3,
    borderColor: "#404040",
    borderWidth: 1,
    borderRadius: 4,
    flex: 1,
    alignSelf: "center"
  },
  pageButtonHighlight: {
    backgroundColor: "yellow",
    height: wp("6%"),
    width: wp("6%"),
    margin: 3,
    borderRadius: 4,
    alignSelf: "center"
  }
});

export default ViewLegs;
