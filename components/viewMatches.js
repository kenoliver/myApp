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
import HeaderButton from "./headerButton";
import { setItem, getItem } from "../services/storage";

export class ViewMatches extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      matchesDataSource: [],

      title: "NO MATCHES FOUND"
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: <View />,
    headerLeft: (
      <HeaderButton title="BACK" onPress={() => navigation.goBack(null)} />
    )
  });

  componentDidMount = () => {
    var dataSource;

    getItem("matches", []).then(data => {
      this.setState({ matchesDataSource: data });
    });
  };

  renderListView() {
    if (!(this.state.matchesDataSource == null)) {
      if (this.state.matchesDataSource.length === 0) {
        return (
          <View style={{flex:1,justifyContent:"center",backgroundColor:"yellow"}}>
            <Text style={styles.title}>{this.state.title}</Text>
          </View>
        );
      } else {
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });

        return (
          <ListView
            dataSource={ds.cloneWithRows(this.state.matchesDataSource)}
            renderRow={this.renderRow.bind(this)}
          />
        );
      }
    }
  }

  renderRow(matchData) {
    console.log("rendering row");
    var newMatch = new Match();

    newMatch.matchData = matchData;
    const matchStats = matchData.players ? newMatch.allPlayerStats() : null;
    var date = matchData.id
      ? new Date(parseInt(matchData.id)).toDateString()
      : "";
    var playerName_1 = matchData.players
      ? matchData.players[0].name
      : "england";
    var playerName_2 = matchData.players
      ? matchData.players[1].name
      : "england";
    var flag_1 = matchData.players ? matchData.players[0].flag : "england";
    var flag_2 = matchData.players ? matchData.players[1].flag : "england";
    var id = matchData.id ? matchData.id : "";
    var wins_1 = matchData.scores ? matchStats[0].checkouts.length : 0;
    var wins_2 = matchData.scores ? matchStats[1].checkouts.length : 0;

    return (
      <View style={{ flex: 1 }}>
        <TouchableHighlight
          key={id}
          onPress={() => {
            this.props.navigation.navigate("Stats", { match: newMatch });
          }}
        >
          <View style={styles.playerRow}>
            <View style={styles.DateBox}>
              <Text style={styles.DateText}>{date}</Text>
            </View>
            <View style={styles.playerBox}>
              <Flag code={flag_1} size={32} type="flat" />
              <Text style={styles.playerText}>{playerName_1}</Text>
            </View>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>
                {wins_1} - {wins_2}
              </Text>
            </View>

            <View style={styles.playerBox}>
              <Flag code={flag_2} size={32} type="flat" />
              <Text style={styles.playerText}>{playerName_2}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>{this.renderListView()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
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
    marginBottom: hp("5%"),
    
  },

  playerRow: {
    flexDirection: "row",
    marginLeft: 1,
    marginTop: 2,
    marginBottom: 2,
    height: hp("7%"),
    flex: 1
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
    
    fontSize: wp("2.5%"),
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
    flex: 1.4,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center"
  },
  scoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("3.8%")
  }
});

export default ViewMatches;
