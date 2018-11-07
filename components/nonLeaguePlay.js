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
import { MatchData } from "../services/matchData";
import { setItem , getItem } from "../services/storage";
import HeaderButton from "./headerButton";
export class NonLeaguePlay extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      countryDataSource: ds.cloneWithRows(countries),
      gameDataSource: ds.cloneWithRows(["X01"]),
      playerDataSource: ds.cloneWithRows([{name:"Bill",flag:"US"},{name:"Ralph",flag:"scotland"}]),
      flags: ["england", "US"],
      players: ["Player 1", "Player 2"],
      playerList:[{name:"Bill",flag:"US"},{name:"Ralph",flag:"scotland"}],
      labels: ["Player 1", "Player 2"],
      throwers: [true, false],
      activePlayer: 0,
      gameType: "X01",
      startCount: "501",
      numberOfLegs: "7",
      gameTitle:"Non-League Play",
      showModal: false,
      showGameModal: false,
      showPlayerModal: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft:(
      <HeaderButton title="BACK" onPress={()=>navigation.goBack(null)} />
    ) ,
    
    headerRight: (
      <View>
       
      </View>
    ),
   
  });


  componentDidMount=()=>{
    // const obj =[{name:"Player 1",flag:"england"},{name:"Player 2",flag:"scotland"}]
    // this.setState({playerList:obj})
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    getItem("playerList")
    .then((data)=>{
   
      if(data===null || data.length === 0){
        
       
         const obj =[{name:"Player 1",flag:"england"},{name:"Player 2",flag:"scotland"}]
          setItem('playerList',obj)
          .then((data)=>this.setState({playerList:obj,playerDataSource:ds.cloneWithRows(obj)}))
        
        }else{
          
         
          this.setState({playerList:data,players:[data[0].name,data[1].name],flags:[data[0].flag,data[1].flag],playerDataSource:ds.cloneWithRows(data)})
       
        }
     
    })
  
   
  }
  renderGameRow(game) {
    return (
      <TouchableHighlight
        key={game}
        onPress={() => {
          this.setState({ gameType: game, showGameModal: false });
        }}
      >
        <View style={styles.row}>
          <Text style={styles.rowTextDark}>{game}</Text>
        </View>
      </TouchableHighlight>
    );
  }
  renderPlayerModalRow(player) {
    return (
      <TouchableHighlight
        key={player.name}
        onPress={() => {
          let flags = this.state.flags;
          let players = this.state.players
          flags[this.state.activePlayer] = player.flag;
          players[this.state.activePlayer] = player.name;
          this.setState({ flags: flags, players:players,showPlayerModal: false });
        }}
      >
        <View style={styles.row}>
           <Text style={styles.rowTextDark}>{player.name}</Text>
          <View style={styles.rowFlag}>
            <Flag code={player.flag} size={32} type="flat" />
          </View>

         
        </View>
      </TouchableHighlight>
    );
  }
  renderRow(country) {
    return (
      <TouchableHighlight
        key={country.code}
        onPress={() => {
          let flags = this.state.flags;
          flags[this.state.activePlayer] = country.code;
          this.setState({ flags: flags, showModal: false });
        }}
      >
        <View style={styles.row}>
          <View style={styles.rowFlag}>
            <Flag code={country.code} size={32} type="flat" />
          </View>

          <Text style={styles.rowTextDark}>{country.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
  renderButton(title, routeName) {

    return (
      <TouchableHighlight
        key={title}
        style={styles.button}
        onPress={() =>{
          let matchData = new MatchData()
        
          matchData.players[0].name = this.state.players[0]
          matchData.players[0].flag = this.state.flags[0]
          matchData.players[0].order = this.state.throwers[0] ? 1 :2
          matchData.players[1].name = this.state.players[1]
          matchData.players[1].flag = this.state.flags[1]
          matchData.players[1].order = this.state.throwers[1] ? 1 :2
          matchData.gameType =this.state.gameType
          matchData.startCount =this.state.startCount
          matchData.numberOfLegs =this.state.numberOfLegs
          matchData.gameTitle =this.state.gameTitle
            let match = new Match(matchData)
          this.props.navigation.navigate("Scorer",{match:match})}
        } 
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableHighlight>
    );
  }

  renderPlayerRow(player) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
     
    });
     var playerDataSource = ds.cloneWithRows(this.state.playerList)
    return (
      <View style={styles.statRow}>
        <View style={styles.statNumberBox}>
          <Text style={styles.statNumberText}>{this.state.labels[player]}</Text>
        </View>
        <TouchableHighlight
          onPress={() => this.setState({ showPlayerModal: true, activePlayer: player})}
          style={styles.statTitleBox}
        >

 <View style={styles.playerInputRow}>
           <Text style={styles.rowText}>{this.state.players[player]}</Text>
          <View style={styles.rowFlag}>
            <Flag code={this.state.flags[player]} size={32} type="flat" />
          </View>

         
        </View>

       




       
         
        </TouchableHighlight>
       
       
        <View style={styles.statSwitchBox}>
          <Text style={styles.statSwitchText}>First to Throw</Text>
          <Switch
            value={this.state.throwers[player]}
            onValueChange={val => {
              let throwers = this.state.throwers;
              throwers[0] = !throwers[0];
              throwers[1] = !throwers[1];
              this.setState({ throwers });
            }}
            trackColor={{ false: "white", true: "red" }}
            thumbColor={"red"}
          />
        </View>
        <Modal  onRequestClose={()=>{}} visible={this.state.showPlayerModal} animationType="slide">
          <TouchableHighlight
         
            onPress={() => this.setState({ showPlayerModal: false })}
          >
            <Text>Press</Text>
          </TouchableHighlight>
          <View>
            <ListView
              dataSource={this.state.playerDataSource}
              renderRow={this.renderPlayerModalRow.bind(this)}
            />
          </View>
          </Modal>
        <Modal  onRequestClose={()=>{}} visible={this.state.showModal} animationType="slide">
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

  renderGameTypeRow() {
    return (
      <View style={styles.statRow}>
        <View style={styles.statNumberBox}>
          <Text style={styles.statNumberText}>Game</Text>
        </View>

        <TouchableHighlight
          onPress={() => this.setState({ showGameModal: true })}
          style={styles.statTitleBox}
        >
          
          <View>
            <Text style={styles.statTitleText} value={this.state.gameType}>{this.state.gameType}</Text>
          </View>
        </TouchableHighlight>
       
        <View style={styles.rowSpace}></View>
        <Modal onRequestClose={()=>{}} visible={this.state.showGameModal} animationType="slide">
          <TouchableHighlight

            onPress={() => this.setState({ showGameModal: false })}
          >
            <Text>Press</Text>
          </TouchableHighlight>
          <View>
            <ListView
              dataSource={this.state.gameDataSource}
              renderRow={this.renderGameRow.bind(this)}
            />
          </View>
        </Modal>
      </View>
    );
  }
  renderGameNumberRow() {
    return (
      <View style={styles.statRow}>
        <View style={styles.statNumberBox}>
          <Text style={styles.statNumberText}>Start</Text>
        </View>

       
          
          <View style={styles.statTitleBox}>
            <TextInput style={styles.statTitleText} value={this.state.startCount} onChangeText={val => 
              this.setState({ startCount:val })}></TextInput>
          </View>
      
        
        <View style={styles.rowSpace}></View>
       
      </View>
    );
  }
  renderGameTitleRow() {
    return (
      <View style={styles.statRow}>
        <View style={styles.statNumberBox}>
          <Text style={styles.statNumberText}>Title</Text>
        </View>

       
          
          <View style={styles.statTitleBox}>
            <TextInput style={styles.statTitleText} value={this.state.gameTitle} onChangeText={val => 
              this.setState({ gameTitle:val })}></TextInput>
          </View>
      
        
        <View style={styles.rowSpace}></View>
        
      </View>
    );
  }
  renderLegsRow() {
    return (
      <View style={styles.statRow}>
        <View style={styles.statNumberBox}>
          <Text style={styles.statNumberText}>Legs</Text>
        </View>

       
          
          <View style={styles.statTitleBox}>
            <TextInput style={styles.statTitleText} value={this.state.numberOfLegs} onChangeText={val => 
              this.setState({ numberOfLegs:val })}></TextInput>
          </View>
      
        <View style={styles.rowSpace}></View>
        
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>NEW MATCH</Text>
        {this.renderPlayerRow(0)}
        {this.renderPlayerRow(1)}
        {this.renderGameTypeRow()}
        {this.renderGameNumberRow()}
        {this.renderLegsRow()}
        {this.renderGameTitleRow()}
        {this.renderButton("Start Match", "Scorer")}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:"#82ac1a",
    backgroundColor: "#262626",
    padding: wp("2%"),
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    // color: "white",
    color: "#777777",
    fontSize: wp("5%"),
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: hp("2%"),
    marginBottom: hp("2%")
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
    backgroundColor: "#262626",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 1,
    borderColor: "#404040",
    borderWidth: 1
  },
  statNumberText: {
    // color: "white",
    color: "#777777",
    // fontWeight: "bold",
    fontSize: wp("3.0%"),
    fontFamily: "normal",
   
  },
  statTitleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "normal",
    padding:10
   
  },
  statSwitchBox: {
    flex: 1,
    flexDirection: "column",

    justifyContent: "center",
    alignItems: "center"
  },
  statSwitchText: {
    color: "white",
    // color: "#777777",
   
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
  playerInputRow:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "white",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "normal",
    flex: 5,
    alignSelf: "center",
   
    paddingLeft: 10
  },
  rowTextDark: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "normal",
    flex: 5,
    alignSelf: "center",
    paddingLeft: 10,
   
  },
  rowFlag: {
    flex: 1,
    alignSelf: "center"
  },
  rowSpace:{
    flex: 1
  }
});

export default NonLeaguePlay;
