import React, { Component } from "react";
import { AppRegistry, Text, View, StyleSheet, TextInput , Switch } from "react-native";

export default class Component3 extends Component {
    constructor(){
        super();
        this.state = {
            textValue:"Hello",
            switchValue:false
        }
    }
  onPress(){
    console.log("AreaPressed")
  }

  onPress2(){
    alert("AreaPressed")
  }
  onChangeText(value){
    this.setState({textValue:value})
  }
  onSubmit(){
      alert("inputSubmitted")
  }
  onValueChange(value){
    this.setState({switchValue:value})
  }
  
  
  render() {
    return (
      <View>
          <TextInput 
          placeholder="Enter Text"
          value={this.state.textValue}
          onChangeText={(value)=> this.onChangeText(value)}
          onSubmitEditing ={this.onSubmit}
          />

          <Text>{this.state.textValue}</Text>  
          <Switch value={this.state.switchValue} onValueChange={(value) =>this.onValueChange(value)}/>
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
AppRegistry.registerComponent("Component3", () => Component3);
