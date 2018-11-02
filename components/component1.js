import React, { Component } from "react";
import Flag from "react-native-flags";
import LinearGradient from "react-native-linear-gradient";
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";

export default class Component1 extends Component {
  onPress() {
    console.log("AreaPressed");
  }

  onPress2() {
    alert("AreaPressed");
  }

  render() {
    return (
      <View style={styles.main}>
   
      <Text> Hello</Text>
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
    color: "white"
  },

  top: {
    flex: 2,
    backgroundColor: "#ff0000"
  },
  playerRow: {
    flexDirection: "row"
  },
  playerBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    margin: 1
  },
  playerText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: 30,
    fontFamily: "Calibri"
  },
  mainScorerTitlesRow: {
    flexDirection: "row",
    backgroundColor: "#262626"
  },
  mainScorerTitlesBox2: {
    flex: 2
  },
  mainScorerTitlesBox1: {
    flex: 1
  },
  mainScorerTitlesText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
    fontFamily: "Calibri",
    textAlign: "center",
    borderColor: "#343434",
    borderWidth: 1
  },

  mainScorerRow: {
    flexDirection: "row",

    backgroundColor: "red"
  },
  mainScorerBox2: {
    flex: 2
  },
  mainScorerBox1: {
    flex: 1,
    alignSelf: "stretch"
  },
  mainScorerText2: {
    color: "white",
    fontWeight: "bold",
    fontSize: 50,
    fontFamily: "Calibri",
    textAlign: "center",
    borderColor: "#343434",
    borderWidth: 1
  },
  mainScorerText1: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    fontFamily: "Calibri",
    textAlign: "center",
    borderColor: "#343434",
    borderWidth: 1
  },

  bottom: {
    flex: 1,
    backgroundColor: "blue"
  }
});
AppRegistry.registerComponent("Component1", () => Component1);
