import React, { Component } from "react";
import { AppRegistry, Text, View ,ListView,StyleSheet } from "react-native";


const users =[
    {name: "John Doe"},
    {name:"Brad Traversy"},
    {name:"Bob Williams"}
]


export default class Component4 extends Component {
   
constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})
    this.state = {
        userDataSource: ds.cloneWithRows(users),

    }
   

}

renderRow(user,SectionId,rowId,hightlightRow){
   return(
   <View style={style.row}>
        <Text style={style.rowText}>{user.name}</Text>
    </View>

   )

}
  
  
  render() {
    return (
      <View>
          <ListView 
          dataSource ={this.state.userDataSource}
          renderRow = {this.renderRow.bind(this)}
          />
      </View>
    )
  }
}

const style = StyleSheet.create({
    row:{
        flexDirection:'row',
        justifyContent:'center',
        padding:10,
        backgroundColor: '#f4f4f4',
        marginBottom:3
    },
    rowText:{
        flex:2
    }
})



AppRegistry.registerComponent("Component4", () => Component4);
