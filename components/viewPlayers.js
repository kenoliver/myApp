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

export class ViewPlayers extends Component {
  constructor() {
    super();
    this.state = {
      playersDataSource: [],
      title: "NO PLAYERS FOUND"
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: <View />,
    headerLeft: (
      <HeaderButton title="BACK" onPress={() => navigation.goBack(null)} />
    )
  });

  componentDidMount = () => {
    getItem("playerList", []).then(data => {
      this.setState({ playersDataSource: data });
    });
  };

  renderListView() {
    if (!(this.state.playersDataSource === null)) {
      if (this.state.playersDataSource.length === 0) {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center"
            }}
          >
            <Text style={styles.title}>{this.state.title}</Text>
          </View>
        );
      } else {
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        return (
          <ListView
            dataSource={ds.cloneWithRows(this.state.playersDataSource)}
            renderRow={this.renderRow.bind(this)}
          />
        );
      }
    }
  }

  renderRow(player) {
    return (
      <TouchableHighlight
        key={player.name}
        onPress={() => {
          // let flags = this.state.flags;
          // let players = this.state.players;
          // flags[this.state.activePlayer] = player.flag;
          // players[this.state.activePlayer] = player.name;
          // this.setState({
          //   flags: flags,
          //   players: players,
          //   showPlayerModal: false
          // });
        }}
      >
        <View style={styles.row}>
          <Text style={styles.rowTextDark}>{player.name}</Text>
          <View style={styles.rowFlag}>
            <Flag code={player.flag} size={32} type="flat" />
          </View>
        </View>
      </TouchableHighlight>
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
    alignSelf: "center"
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f4f4f4",
    marginBottom: 3,
    height: hp("7%")
  },

  rowText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "normal",
    flex: 5,
    alignSelf: "center",

    paddingLeft: 10
  },
  rowTextDark: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "normal",
    flex: 5,
    alignSelf: "center",
    paddingLeft: 10
  },
  rowFlag: {
    flex: 1,
    alignSelf: "center"
  }
});

export default ViewPlayers;
