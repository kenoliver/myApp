import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableHighlight,
  StyleSheet
} from "react-native";
import { logoLarge, logoSpots } from "../images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";

export class Home extends Component {
  renderButton(title, routeName) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableHighlight
          key={title}
          style={styles.button}
          onPress={() => this.props.navigation.navigate({ routeName })}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableHighlight>
      </View>
    );
  }
  static navigationOptions = ({ navigation }) => ({
   header:null
  });

  render() {
   
    return (
      <View style={styles.container}>
       
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={logoSpots} />
        </View>
      
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Darts Scoreboard</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}></Text>
        </View>
        {this.renderButton("New Match", "NonLeaguePlay")}
        {this.renderButton("New Player", "AddPlayer")}
        {this.renderButton("All Matches", "ViewMatches")}
        {this.renderButton("All Players", "ViewPlayers")}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: wp("5%"),
    flex: 1,
    backgroundColor:"#82ac1a",
    // backgroundColor: "#262626",
    alignItems: "center"
  },

  imageContainer: {
    flex: 1.5,
    width: wp("90%"),
   
    
  },

  image: {
    flex:1,
    width: wp("90%"),
    margin: 0,
    resizeMode: "contain"
  },

  titleContainer: {
    flex: .5,
   
  },

  title: {
    color: "white",
    fontSize: wp("7%"),
    fontWeight: "900",
    letterSpacing: -2,
    fontStyle:"italic"
     
  },

  button: {
    backgroundColor: "red",
   
    width: wp("60%"),
    padding: wp("2%"),
    margin: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("3%"),
    borderColor: "white",
    // borderWidth:1,
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
   
  },
  buttonText: {
    color: "white",
    fontSize: wp("5%")
  }
});

export default Home;
