import React, { Component } from "react";
import Flag from "react-native-flags";
import LinearGradient from "react-native-linear-gradient";
import { AddScore } from "../services/addScore";
import { AddRow } from "../services/addRow";
import { Match } from "../services/match";
import Modal from "react-native-modal";
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
import { setItem, getItem } from "../services/storage";
import { AsyncStorage } from "react-native";

export default class Scorer extends Component {
  constructor(props) {
    super(props);
    this.endPress = this.endPress.bind(this);
    this.statsPress = this.statsPress.bind(this);
    this.enterPress = this.enterPress.bind(this);
    this.undoPress = this.undoPress.bind(this);
  }
  state = {
    match: null,
    remaining1: 0,
    remaining2: 0,
    legs1: 0,
    legs2: 0,
    value: 0,
    missedDoubles: 0,
    dartsThrown: 3,
    rows: [],
    modalVisible: 0,
    finished: false,
    allMatches: []
  };

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <View style={styles.navButton}>
        <TouchableOpacity onPress={navigation.getParam("endPress")}>
          <Text style={styles.navText}>END GAME</Text>
        </TouchableOpacity>
      </View>
    ),
    headerLeft: (
      <View style={styles.navButton}>
        <TouchableOpacity onPress={navigation.getParam("statsPress")}>
          <Text style={styles.navText}>STATS</Text>
        </TouchableOpacity>
      </View>
    )
  });

  statsPress() {
    let match = this.state.match;
    this.props.navigation.navigate("Stats", { match: match });
  }

  endPress() {
    let match = this.state.match.matchData;
    match.complete=true;
    var obj = null;
    getItem("matches")
      .then(data => {
        if (!data) {
          obj = data;
        } else {
          var index = data
            .map(function(x) {
              return x.id;
            })
            .indexOf(match.id);
          if (index == -1) {
            data.push(match);
          } else {
            data[index] = match;
          }
         
          this.setState({ allMatches: data }, () => {
            setItem("matches", this.state.allMatches).done();
          });
        }
      })
      .done();
  }

  componentWillMount() {
    const { navigation } = this.props;
    const match = navigation.getParam("match", null);

    this.setState({ match: match });
  }

  componentDidMount() {
    this.props.navigation.setParams({ statsPress: this.statsPress });
    this.props.navigation.setParams({ endPress: this.endPress });

    if (this.state.rows.length === 0) {
      const rows = [new AddRow(1)];
      this.setState({ rows: rows });
    }
    this.state.remaining1 = this.state.match.matchData.startCount;
    this.state.remaining2 = this.state.match.matchData.startCount;
  }

  onPress = num => {
    var val = this.state.value.toString();
    var newval = parseInt(val + num.toString());
    val = val === "0" || newval > 180 ? num.toString() : val + num.toString();

    this.setState({ value: parseInt(parseInt(val)) });
  };

  undoPress() {
    this.state.match.matchData.scores.pop();
    this.resetState();
  }

  enterPress() {
    var player = this.state.match.getThrower(true);
    var leg = this.state.match.getLeg();

    var scored = this.state.value;

    var finished = this.state.match.checkFinished(scored, player, leg);

    this.setState({ finished: finished });
    var showDoubles = this.state.match.showDoubles(scored, player, leg);

    if (showDoubles) {
      this.setState({ modalVisible: 2 });
    } else {
      this.AddScore();
    }
  }

  AddScore() {
    var player = this.state.match.getThrower(true);
    var leg = this.state.match.getLeg();
    var visit = this.state.match.getVisit(leg, player);
    var scored = this.state.value;
    var missedDoubles = this.state.missedDoubles;
    var dartsThrown = this.state.dartsThrown;
    var finished = this.state.finished;

    var bust = this.state.match.isBust(scored, player, leg);

    if (!bust) {
      var score = new AddScore(
        player,
        leg,
        visit,
        scored,
        dartsThrown,
        missedDoubles,
        finished
      );
      let scores = this.state.match.matchData.scores;
      scores.push(score);
      this.setState({
        scores: scores
      });
    }

    this.resetState();
  }

  resetState() {
    var obj = this.state.match.getNewState();

    this.setState({
      value: 0,
      remaining1: obj.remainings[0],
      remaining2: obj.remainings[1],
      legs1: obj.wins[0],
      legs2: obj.wins[1],
      rows: obj.visitRows,
      finished: false,
      missedDoubles: 0,
      dartsThrown: 3
    });
  }

  renderInputBox(index, playerid) {
    var playerIndex = this.state.match.playerIndex(playerid);
    var thrower = this.state.match.getThrower(true);
    var opacity = playerid == thrower ? 1.0 : 0.6;
    if (index == this.state.rows.length - 1 && playerid == thrower) {
      return (
        <View style={styles.allScoresBoxHighlight} opacity={opacity}>
          <Text style={styles.allScoresText2}>{this.state.value}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.allScoresBox2} opacity={opacity}>
          <Text style={styles.allScoresText2}>
            {this.state.rows[index].players[playerIndex].score}
          </Text>
        </View>
      );
    }
  }
  /////test
  setModalVisible(visible, value) {
    if (this.state.modalVisible === 2 && !this.state.finished) {
      this.setState({ missedDoubles: value }, function() {
        this.AddScore();
      });
    } else if (this.state.modalVisible === 1) {
      this.setState({ dartsThrown: value, modalVisible: visible }, function() {
        this.AddScore();
      });
    }
    if (this.state.modalVisible === 2 && this.state.finished) {
      this.setState({ modalVisible: 1, missedDoubles: value });
    } else {
      this.setState({ modalVisible: visible });
    }
  }

  render() {
    const thrower = this.state.match.getThrower(true);

    var opacity1;
    var opacity2;
    if (thrower == "player-1") {
      opacity1 = 1.0;
      opacity2 = 0.6;
    } else {
      opacity1 = 0.6;
      opacity2 = 1.0;
    }

    return (
      <View style={styles.main}>
        <View style={styles.top}>
          <View style={styles.playerRow}>
            <View style={styles.playerBox} opacity={opacity1}>
              <Flag
                code={this.state.match.matchData.players[0].flag}
                size={32}
                type="flat"
              />
              <Text style={styles.playerText}>
                {this.state.match.matchData.players[0].name}
              </Text>
            </View>

            <View style={styles.playerBox} opacity={opacity2}>
              <Flag
                code={this.state.match.matchData.players[1].flag}
                size={32}
                type="flat"
              />
              <Text style={styles.playerText}>
                {this.state.match.matchData.players[1].name}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.mainScorerTitlesRow}>
            <View style={styles.mainScorerTitlesBox2}>
              <Text style={styles.mainScorerTitlesText}>REMAINING</Text>
            </View>
            <View style={styles.mainScorerTitlesBox1}>
              <Text style={styles.mainScorerTitlesText}>LEGS</Text>
            </View>
            <View style={styles.mainScorerTitlesBox1}>
              <Text style={styles.mainScorerTitlesText}>LEGS</Text>
            </View>
            <View style={styles.mainScorerTitlesBox2}>
              <Text style={styles.mainScorerTitlesText}>REMAINING</Text>
            </View>
          </View>

          <View style={styles.mainScorerRow}>
            <View style={styles.mainScorerBox2} opacity={opacity1}>
              <Text style={styles.mainScorerText2}>
                {this.state.remaining1}
              </Text>
            </View>
            <View style={styles.mainScorerBox1} opacity={opacity1}>
              <Text style={styles.mainScorerText1}>{this.state.legs1}</Text>
            </View>
            <View style={styles.mainScorerBox1} opacity={opacity2}>
              <Text style={styles.mainScorerText1}>{this.state.legs2}</Text>
            </View>
            <View style={styles.mainScorerBox2} opacity={opacity2}>
              <Text style={styles.mainScorerText2}>
                {this.state.remaining2}
              </Text>
            </View>
          </View>

          <View style={styles.gameTitlesRow}>
            <View style={styles.gameTitlesBox1}>
              <Text style={styles.gameTitlesText}>IDL</Text>
            </View>
            <View style={styles.gameTitlesBox1}>
              <Text style={styles.gameTitlesText}>
                {this.state.match.matchData.gameTitle}
              </Text>
            </View>
            <View style={styles.gameTitlesBox1}>
              <Text style={styles.gameTitlesText}>
                BEST OF {this.state.match.matchData.numberOfLegs} LEGS
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.allScores}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            {this.state.rows.map((row, index) => {
              const player1 = this.renderInputBox(
                index,
                this.state.match.matchData.players[0].id
              );
              const player2 = this.renderInputBox(
                index,
                this.state.match.matchData.players[1].id
              );
              // alert(JSON.stringify(this.state.rows))
              return (
                <View key={index} style={styles.allScoresRow}>
                  <View style={styles.allScoresBox3} opacity={opacity1}>
                    <Text style={styles.allScoresText3}>
                      {row.players[0].remaining}
                    </Text>
                  </View>
                  {player1}
                  <View style={styles.allScoresBox1}>
                    <Text style={styles.allScoresText1}>{row.visit * 3}</Text>
                  </View>
                  {player2}
                  <View style={styles.allScoresBox3} opacity={opacity2}>
                    <Text style={styles.allScoresText3}>
                      {row.players[1].remaining}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.bottom}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => this.onPress(1)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPress(2)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPress(3)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => this.onPress(4)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>4</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPress(5)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>5</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPress(6)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>6</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => this.onPress(7)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>7</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPress(8)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>8</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPress(9)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>9</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.entryButton}
              onPress={this.undoPress}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>UNDO</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onPress(0)}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.enterPress}
              style={styles.entryButton}
            >
              <View style={styles.entryButton}>
                <Text style={styles.entryButtonText}>ENTER</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          isVisible={this.state.modalVisible === 1}
          animationIn={"slideInLeft"}
          animationOut={"slideOutRight"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Darts Thrown?</Text>
            <TouchableOpacity onPress={() => this.setModalVisible(0, 1)}>
              <View style={styles.button}>
                <Text style={styles.modalText}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setModalVisible(0, 2)}>
              <View style={styles.button}>
                <Text style={styles.modalText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setModalVisible(0, 3)}>
              <View style={styles.button}>
                <Text style={styles.modalText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.modalVisible === 2}
          animationIn={"slideInLeft"}
          animationOut={"slideOutRight"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Doubles Missed?</Text>
            <TouchableOpacity onPress={() => this.setModalVisible(0, 0)}>
              <View style={styles.button}>
                <Text style={styles.modalText}>0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setModalVisible(0, 1)}>
              <View style={styles.button}>
                <Text style={styles.modalText}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setModalVisible(0, 2)}>
              <View style={styles.button}>
                <Text style={styles.modalText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setModalVisible(0, 3)}>
              <View style={styles.button}>
                <Text style={styles.modalText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whiteGradient: {
    flex: 1
  },

  main: {
    backgroundColor: "#262626",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5
  },
  menu: {
    height: 20
  },
  menuText: {
    color: "white",
    fontSize: 10,
    lineHeight: 20
  },

  top: {
    flex: 2
    // backgroundColor: "#ff0000"
  },
  playerRow: {
    flexDirection: "row",
    marginLeft: 1,
    height: hp("7%")
  },
  playerBox: {
    flex: 1,
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
  mainScorerTitlesRow: {
    flexDirection: "row",
    marginLeft: 1,
    height: hp("2%")
  },
  mainScorerTitlesBox2: {
    flex: 2.5,
    backgroundColor: "#262626",
    borderWidth: 1,
    borderColor: "#363636",
    marginRight: 1,
    justifyContent: "center"
  },
  mainScorerTitlesBox1: {
    flex: 1,
    backgroundColor: "#262626",
    borderWidth: 1,
    borderColor: "#363636",
    marginRight: 1,
    justifyContent: "center"
  },
  mainScorerTitlesText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("2%"),
    lineHeight: 20,
    fontFamily: "Calibri",
    textAlign: "center",
    alignSelf: "center"
  },

  mainScorerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 1,
    height: hp("10%")
  },
  mainScorerBox2: {
    flex: 2.5,
    borderColor: "#c00000",
    borderWidth: 1,
    backgroundColor: "red",
    marginRight: 1,
    justifyContent: "center"
  },
  mainScorerBox1: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#c00000",
    borderWidth: 1,

    marginRight: 1,
    backgroundColor: "red",
    justifyContent: "center"
  },
  mainScorerText2: {
    color: "white",

    fontWeight: "bold",
    fontSize: wp("12%"),
    lineHeight: wp("13%"),
    fontFamily: "normal",
    textAlign: "center",
    alignSelf: "center"
  },
  mainScorerText1: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("10%"),
    fontFamily: "Calibri",
    textAlign: "center",
    alignSelf: "center"
  },
  gameTitlesRow: {
    flexDirection: "row",
    backgroundColor: "#262626",
    borderWidth: 2,
    borderColor: "#363636",
    height: hp("2%")
  },

  gameTitlesBox1: {
    flex: 1,
    justifyContent: "center"
  },
  gameTitlesText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("2%"),
    lineHeight: 20,
    fontFamily: "Calibri",
    textAlign: "center",
    fontStyle: "italic",
    alignSelf: "center"
  },

  allScoresRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 1,
    height: hp("7%")
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
    backgroundColor: "#262626"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",

    flex: 1
  },
  entryButton: {
    flex: 1,
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
    justifyContent: "center",
    margin: 5,
    padding: 1
  },
  entryButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: wp("5%")
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "red",
    color: "white",
    width: wp("40%"),
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "#262626",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalText: {
    color: "white",
    fontWeight: "700"
  },
  navButton: {
    width: wp("16%"),
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderColor: "#404040",
    borderWidth: 1
  },
  navText: {
    color: "#777777",
    fontSize: wp("2%"),
    fontWeight: "700",
    textAlign: "center"
  },
  allScores: {}
});
AppRegistry.registerComponent("scorer", () => Scorer);
