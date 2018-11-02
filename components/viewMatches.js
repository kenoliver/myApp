import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  View,
  Text,
  Button,
  Image,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Switch,
  Picker,
  Modal,
  ListView
} from "react-native";
import Flag from "react-native-flags";

import { logoLarge } from "../images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
import { countries } from "../services/countries";
import { Match } from "../services/match";

import { setItem, getItem } from "../services/storage";

export class ViewMatches extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      matchesDataSource: ds.cloneWithRows([]),
      showModal: true
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: <View />
  });

  componentDidMount = () => {
    getItem("matches").then(data => {
      if (data == null) {
      } else {
        console.log("Data: " + JSON.stringify(data));
        const dataSource = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState({ matchesDataSource: dataSource.cloneWithRows(data) });
      }
    });
  };

  renderRow(matchData) {
    console.log("rendering row");
    var newMatch = new Match();

    newMatch.matchData = matchData;
    const matchStats = newMatch.allPlayerStats();
    var date = new Date(parseInt(matchData.id)).toDateString();
    return (
      <TouchableHighlight
        key={matchData.id}
        onPress={() => {
          this.setState({showModal:false});
          this.props.navigation.navigate("Stats", { match: newMatch });
        }}
      >
        <View style={styles.playerRow}>
          <View style={styles.DateBox}>
            <Text style={styles.DateText}>{date}</Text>
          </View>
          <View style={styles.playerBox}>
            <Flag
              code={newMatch.matchData.players[0].flag}
              size={32}
              type="flat"
            />
            <Text style={styles.playerText}>
              {newMatch.matchData.players[0].name}
            </Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>
              {matchStats[0].checkouts.length} -{" "}
              {matchStats[1].checkouts.length}
            </Text>
          </View>

          <View style={styles.playerBox}>
            <Flag
              code={newMatch.matchData.players[1].flag}
              size={32}
              type="flat"
            />
            <Text style={styles.playerText}>
              {newMatch.matchData.players[1].name}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Matches</Text>
        <View>
          <Modal
            onRequestClose={() => {}}
            visible={this.state.showModal}
            animationType="slide"
          >
            <TouchableHighlight
              onPress={() => this.setState({ showModal: false })}
            >
              <Text>Press</Text>
            </TouchableHighlight>
            <View>
              <ListView
                dataSource={this.state.matchesDataSource}
                renderRow={this.renderRow.bind(this)}
              />
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262626",
    padding: wp("2%"),
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    color: "#777777",
    fontSize: wp("5%"),
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: hp("5%")
  },

  playerRow: {
    flexDirection: "row",
    marginLeft: 1,
    marginTop: 2,
    marginBottom: 2,
    height: hp("7%")
  },
  DateBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 1,
    borderRightColor: "#d9d9d9",
    borderRightWidth: 1
  },
  DateText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("3%"),
    fontFamily: "normal"
  },
  playerBox: {
    flex: 3,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 1
  },
  playerText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("4%"),
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
    fontSize: wp("4%")
  }
});

export default ViewMatches;
