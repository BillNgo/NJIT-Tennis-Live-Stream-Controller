import React, { Component } from 'react';
import firebase from './firebase';
import './Overlay.css'

const db = firebase.firestore();

class Overlay extends Component {
  constructor(props){
    super(props);
    const courtID = props.match.params.id;
    this.state = {
      isAuth : true,
      courtID : courtID,
      court: {isDouble:false,isLive:false,currentSet:1,setCount:3},
      team1 : {name:'',score:'0',setScores:[0,0,0,0,0,0]},
      player1 : {name:''},
      player2 : {name:''},
      team2 : {name:'',score:'0',setScores:[0,0,0,0,0,0]},
      player3 : {name:''},
      player4 : {name:''},
    }
  }

  componentDidMount(){
    db.settings({
      timestampsInSnapshots: true
    });
    this.initOverlay();
  }

  getCorrectColor = (score) => {
    return score === 6 ? 'black' : 'white'
  }

  getCorrectBgColor = (score) => {
    return score === 6 ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'
  }

  getTeamMatchPoints = (teamNum) => {
    let points = 0;

    const setCount = this.state.court.setCount;
    for(var i = 1; i<6; i++){
      let T1setScore = this.state['team'+teamNum].setScores[i];
      let T2setScore = this.state['team'+(3-teamNum)].setScores[i];
      
      if(i === setCount && T1setScore >= 10 && T1setScore - T2setScore >= 2){
        points++
      }else if(i !== setCount && ((T1setScore === 6 && T1setScore - T2setScore >= 2) || T1setScore === 7)){
        points++
      }
    }
    return points;
  }

  generateSetScores = (teamNum) => {
    var html = [];
    for(var i = 1; i<=Math.min(this.state.court.currentSet,this.state.court.setCount);i++){
      let setScoreStyle = this.state.court.currentSet === i ?
      {
      borderRadius:5,
      fontSize:25,
      fontFamily:'Verdana',
      fontWeight:1000,
      textShadow: '1px 1px 2px black',
      backgroundImage:'linear-gradient(#ccc,white)',
      color:'rgba(204,0,0,1)',
      minWidth:60,
      lineHeight:'50px',
      textAlign:'center'} :

      {
      borderRadius:5,
      fontSize:25,
      textShadow: '1px 1px 2px black',
      backgroundImage:'linear-gradient(rgba(0,0,0,0.9),rgba(0,0,0,0.5))',
      minWidth:60,      
      lineHeight:'50px',
      textAlign:'center'};

      html.push(<td style={{minWidth:10}}></td>);

      html.push(<td style={setScoreStyle}>
          {this.state['team'+teamNum].setScores[i]}
          </td>)
    }
    return html;
  }

  generateGameScore = (teamNum) => {
    if(this.state.court.currentSet === this.state.court.setCount) return;
    return (
      <td style={{backgroundImage:'linear-gradient(rgba(170,0,0,0.85),rgba(204,0,0,0.85))',padding:10,textAlign:'center',minWidth:60,borderRadius:5}}>
        <span style={{textShadow: '1px 1px 2px black',fontSize:25,color:'white',fontFamily:'Verdana',fontWeight:1000}}>
          {this.state['team'+teamNum].score}
        </span>
      </td>
    );
  }

  generateTeamRow = (teamNum) => {
    return (
      <tr>
        <td style={{backgroundImage:'linear-gradient(rgba(170,0,0,0.85),rgba(204,0,0,0.85))',paddingLeft:50,paddingRight:15,width:200}}>
          <span style={{textShadow: '1px 1px 2px black',fontSize:35,color:'white',fontFamily:'Verdana',fontWeight:1000}}>{this.state['team'+teamNum].name}</span>
        </td>
        <td style={{backgroundImage:'linear-gradient(rgba(170,0,0,0.85),rgba(204,0,0,0.85))',textAlign:'center',width:60,borderTopRightRadius:5,borderBottomRightRadius:5}}>
          <span style={{textShadow: '1px 1px 2px black',fontSize:35,color:'white',fontFamily:'Verdana',fontWeight:1000}}>{this.getTeamMatchPoints(teamNum)}</span>
        </td>
        {this.generateSetScores(teamNum)}
        <td style={{minWidth:10}}></td>
        {this.generateGameScore(teamNum)}
      </tr>   
    )
  }

  generateGameTitle = () => {
    if(this.state.court.currentSet === this.state.court.setCount) return;
    return <td>GAME</td>;
  }

  render() {
    return (
      <div> {/* style={{height:1080,width:1920}}> */}
        <div style={{position:'absolute',bottom:100,left:100}}>
          <img style={{height:200}} src="/img/NJIT_Highlanders_logo.svg" alt=""></img>
          <table style={{position:'absolute',bottom:30,left:190,zIndex:-1}}>
            <tbody>
              <tr style={{fontSize:18,textAlign:'center'}}>
                <td style={{paddingLeft:50,textAlign:'left'}}>TEAM</td>
                <td>TOTAL</td>
                <td className={this.state.court.currentSet >= 1 ? 'd-table-cell':'d-none'}></td>
                <td className={this.state.court.currentSet >= 1 ? 'd-table-cell':'d-none'}>SET 1</td>
                <td className={this.state.court.currentSet >= 2 ? 'd-table-cell':'d-none'}></td>
                <td className={this.state.court.currentSet >= 2 ? 'd-table-cell':'d-none'}>SET 2</td>
                <td className={this.state.court.currentSet >= 3 ? 'd-table-cell':'d-none'}></td>
                <td className={this.state.court.currentSet >= 3 ? 'd-table-cell':'d-none'} style={{fontSize:14}}>TIE BRK</td>
                <td></td>
                {this.generateGameTitle()}
              </tr>
              {this.generateTeamRow(1)}
              <tr style={{height:10}}></tr>
              {this.generateTeamRow(2)} 
            </tbody>
          </table>
        </div>
        
      </div>
    )
  }

  initOverlay = () => {
    //db.collection('courts').doc('activeCourt').get().then(doc => {
    //  const courtID = doc.data().courtID
  
      const court = db.collection('courts').doc('court'+this.state.courtID);
      const team1 = court.collection('teams').doc('team1');
      const team2 = court.collection('teams').doc('team2');
      const player1 = team1.collection('players').doc('player1');
      const player2 = team1.collection('players').doc('player2');
      const player3 = team2.collection('players').doc('player1');
      const player4 = team2.collection('players').doc('player2');
  
      this.keepStateUpdated(court,'court')
  
      this.keepStateUpdated(team1,'team1')    
      this.keepStateUpdated(team2,'team2')
      
      this.keepStateUpdated(player1,'player1')
      this.keepStateUpdated(player2,'player2')
      this.keepStateUpdated(player3,'player3')
      this.keepStateUpdated(player4,'player4')
    //})    
  }

  keepStateUpdated(docu,key){
    docu.onSnapshot( doc => {
      this.setState({
      [key] : doc.data()
      })
    })
  }

}

export default Overlay;
