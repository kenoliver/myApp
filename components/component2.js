import React, { Component } from "react";
import { AppRegistry, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

export default class Component2 extends Component {
  onPress(){
    console.log("AreaPressed")
  }

  onPress2(){
    alert("AreaPressed")
  }
  
  
  render() {
    return (
      <View>
        <View style={styles.myView}>
          <Text style={styles.myText}>Hello World</Text>
          <View style={styles.container}>
          <TouchableHighlight onPress={this.onPress} underlayColor="blue">
 <View style={styles.v1}>
              <Text style={styles.myText}>Hello World</Text>
            </View>


          </TouchableHighlight>
           <TouchableOpacity onPress={this.onPress2}>
             <View style={styles.v2}>
              <Text style={styles.myText}>Hello World</Text>
            </View>
           </TouchableOpacity>

            

            <View style={styles.v3}>
              <Text style={styles.myText}>Hello World</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  myView: {
    backgroundColor: "#222222"
  },
  container: {
    flexDirection: "row",
    height: 100
  },
  v1: {
    flex: 1,
    padding: 10
  },
  v2: {
    flex: 1,
    padding: 10
  },
  v3: {
    flex: 1,
    padding: 10
  },
  myText: {
    color: "white",
    fontSize: 10
  }
});
AppRegistry.registerComponent("Component2", () => Component2);
