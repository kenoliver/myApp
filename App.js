/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import Component1 from "./components/component1";

import Home from "./components/home";
import Scorer from "./components/scorer";
import Stats from "./components/stats";
import NewMatch from "./components/newMatch";
import AddPlayer from "./components/addPlayer";
import LeaguePlay from "./components/leaguePlay";
import NonLeaguePlay from "./components/nonLeaguePlay";
import MoreStats from "./components/moreStats";
import ViewLegs from "./components/viewLegs";
import ViewMatches from "./components/viewMatches";
import ViewPlayers from "./components/viewPlayers";
import { createStackNavigator } from "react-navigation";
import { widthPercentageToDP } from "react-native-responsive-screen";
import HeaderTitle from "react-navigation-stack/dist/views/Header/HeaderTitle";
const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Scorer: { screen: Scorer },
    Stats: { screen: Stats },
    MoreStats: { screen: MoreStats },
    ViewLegs: { screen: ViewLegs },
    ViewMatches: { screen: ViewMatches },
    ViewPlayers: { screen: ViewPlayers },
    NewMatch: { screen: NewMatch },
    AddPlayer: { screen: AddPlayer },
    LeaguePlay: { screen: LeaguePlay },
    NonLeaguePlay: { screen: NonLeaguePlay }
  },
  {
  navigationOptions: {
      headerStyle: {
        backgroundColor: "#262626"
      },
      headerTitle: "IDL Scoreboard",
      headerTitleContainerStyle: {
        justifyContent: "center"
      },
      headerTintColor: "#777777",
     
    }
  }
);

export default class App extends Component {
  render() {
    return <AppNavigator />;
  }
}
