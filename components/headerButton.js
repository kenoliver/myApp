import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import {
    widthPercentageToDP as wp,
   
  } from "react-native-responsive-screen";

const HeaderButton = props => {
    return (
        <TouchableOpacity style={styles.navButton} onPress={props.onPress}>
        <Text style={styles.navText}>{props.title}</Text>
      </TouchableOpacity>
    );
  };
  const styles = StyleSheet.create({
    
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
    }
  });
  export default HeaderButton;