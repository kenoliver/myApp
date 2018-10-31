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

export class AddPlayer extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      countryDataSource: ds.cloneWithRows(countries),
      gameDataSource: ds.cloneWithRows(["X01"]),
      flag: "england",
      player: "Player 1",
      playerList: [
        { name: "Bill", flag: "US" },
        { name: "Ralph", flag: "scotland" }
      ],

      throwers: [true, false],
      activePlayer: 0,
      gameType: "X01",
      startCount: "501",
      numberOfLegs: "7",
      gameTitle: "Non-League Play",
      showModal: false,
      showGameModal: false
    };
  }

  componentDidMount() {
    getItem("playerList").then(data => {
      if (data == null) {
        const obj = [
          { name: "Player 1", flag: "england" },
          { name: "Player 2", flag: "scotland" }
        ];
        setItem("playerList", obj).then(data =>
          this.setState({ playerList: obj })
        );
      } else {
        this.setState({ playerList: data });
      }
    });
  }

  renderRow(country) {
    return (
      <TouchableHighlight
        key={country.code}
        onPress={() => {
          let flag = this.state.flag;
          flag = country.code;
          this.setState({ flag: flag, showModal: false });
        }}
      >
        <View style={styles.row}>
          <View style={styles.rowFlag}>
            <Flag code={country.code} size={32} type="flat" />
          </View>

          <Text style={styles.rowText}>{country.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
  renderButton(title) {
    return (
      <TouchableHighlight
        key={title}
        style={styles.button}
        onPress={() => {
          let name = this.state.player;
          let flag = this.state.flag;
          var obj = { name: name, flag: flag };

          let list = this.state.playerList;
          list.push(obj);

       

          setItem('playerList',list)
          .then((data)=> this.props.navigation.navigate("Home"))
        }}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableHighlight>
    );
  }

  renderPlayerRow(player) {
    return (
      <View style={styles.statRow}>
        <View style={styles.statNumberBox}>
          <Text style={styles.statNumberText}>Player</Text>
        </View>

        <View style={styles.statTitleBox}>
          <TextInput
            style={styles.statTitleText}
            onChangeText={val => {
              let player = this.state.player;
              player = val;
              this.setState({ player });
            }}
            value={this.state.player}
          />
        </View>
        <TouchableHighlight
          onPress={() => this.setState({ showModal: true })}
          style={styles.statFlagBox}
        >
          <Flag code={this.state.flag} size={32} type="flat" />
        </TouchableHighlight>
        <View style={styles.statSwitchBox} />
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
              dataSource={this.state.countryDataSource}
              renderRow={this.renderRow.bind(this)}
            />
          </View>
        </Modal>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add Player</Text>
        {this.renderPlayerRow(0)}

        {this.renderButton("New Player", "Home")}
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
    color: "white",
    fontSize: wp("7%"),
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: hp("5%")
  },

  button: {
    backgroundColor: "red",

    width: wp("60%"),
    padding: wp("2"),
    margin: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("3%"),
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonText: {
    color: "white",
    fontSize: wp("5%")
  },
  statRow: {
    flexDirection: "row",

    marginBottom: hp("3%"),
    height: hp("6%")
  },
  statNumberBox: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 1,
    paddingRight: 1,
    marginRight: 1
  },
  statTitleBox: {
    flex: 3,
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
    fontSize: wp("4%"),
    fontFamily: "normal"
  },
  statTitleText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "normal"
  },
  statSwitchBox: {
    flex: 1,
    flexDirection: "column",

    justifyContent: "center",
    alignItems: "center"
  },
  statSwitchText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("2%"),
    fontFamily: "normal"
  },
  statPickerBox: {
    flex: 3,
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 1
  },
  statFlagBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 1,
    paddingRight: 1,
    marginRight: 1
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f4f4f4",
    marginBottom: 3
  },
  rowText: {
    color: "#404040",
    flex: 5,
    alignSelf: "center",
    paddingLeft: 10
  },
  rowFlag: {
    flex: 1,
    alignSelf: "center"
  },
  rowSpace: {
    flex: 1
  }
});

export default AddPlayer;
