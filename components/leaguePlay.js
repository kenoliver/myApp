import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableHighlight,
  StyleSheet,
  TextInput
} from "react-native";
import { logoLarge } from "../images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";



export class LeaguePlay extends Component {

    

    renderButton(title,routeName) {
       
          return (
            <TouchableHighlight
            key={title}   
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Main")}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableHighlight>
          );
     
        }
     
  render() {
    return (
       
      <View style={styles.container}>
       
        <Text style={styles.title}>IDL League Play</Text>
        {this.renderButton("IDL League Play","LeaguePlay")}
        {this.renderButton("Non League Play","NonLeaguePlay")}
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262626",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  
  image: { 
    width:wp("60%"),
   margin:0,
    resizeMode: 'contain'},

  title: {
    color: "white",
    fontSize: wp("7%"),
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: hp("5%"),
    marginTop:hp("-10%")
  },

  button: {
    backgroundColor: "red",
    
    width: wp("60%"),
    padding:  wp("2"),
    margin: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("3%"),
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonText:{
      color:"white",
      fontSize: wp("5%")
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
  allScores: {}
});

export default LeaguePlay;
