import React, { Component } from "react";
import { AppRegistry, Text, View ,ListView,StyleSheet } from "react-native";


const users =[
    {name: "John Doe"},
    {name:"Brad Traversy"},
    {name:"Bob Williams"}
]


export default class Component6 extends Component {
   
constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})
    this.state = {
        userDataSource: ds,

    }
   

}

componentDidMount(){
    this.fetchUsers();
}
fetchUsers(){
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) =>response.json())
    .then((response)=>{
        this.setState({
            userDataSource: this.state.userDataSource.cloneWithRows(response)
        })
    })
}

renderRow(user,SectionId,rowId,hightlightRow){
   return(
   <View style={style.row}>
        <Text style={style.rowText}>{user.name}</Text>
        <Text style={style.rowText}>{user.email}</Text>
    </View>

   )

}
  
  
  render() {
    return (
      <View>
        <Text>Details</Text>
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



AppRegistry.registerComponent("Component6", () => Component6);
