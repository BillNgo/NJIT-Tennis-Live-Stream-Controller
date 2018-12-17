import React, { Component } from 'react';
import Home from './Home';
import firebase from './firebase';
import Settings from './Settings';
import Controller from './Controller';
import FTPDaemon from './FTPDaemon';
import './Main.css';

const db = firebase.firestore();
const auth = firebase.auth();

const GOOGLE = new firebase.auth.GoogleAuthProvider();



class Navbar extends Component {
  generateLiveStreamStatus = () => {
    if(this.props.isLive){
      return(
        <span className="text-secondary ml-2" style={{fontSize:14}}>
          COURT {this.props.court} : LIVE<i className="fas fa-circle text-danger ml-1"></i>
        </span>
      )
    }else{
      return(
        <span className="text-secondary ml-2" style={{fontSize:14}}>
          COURT {this.props.court} : OFFLINE
        </span>
      )
    }
  }

  render(){
    return(
      <nav className="navbar mb-5">
        <a className="navbar-brand" onClick={() => this.props.setCurrentTab("HOME")}>
          <img alt="" style={{height:40}} src='/img/NJIT_Highlanders_Head_Only_logo.svg' />
          {this.generateLiveStreamStatus()}
        </a>
        <ul className="navbar-nav">          
          <li className={"nav-item " + (this.props.currentTab === "SETTINGS" ? "active" : "")}>
            <a className="nav-link" onClick={() => this.props.setCurrentTab("SETTINGS")}>
            <i className="fas fa-cog" style={{fontSize:25}}></i>
            <span className="d-none d-sm-inline ml-1">Settings</span></a>
          </li>
          <li className={"nav-item " + (this.props.currentTab === "CONTROLLER" ? "active" : "")}>
            <a className="nav-link" onClick={() => this.props.setCurrentTab("CONTROLLER")}>
            <i className="fas fa-gamepad" style={{fontSize:25}}></i>
            <span className="d-none d-sm-inline ml-1">Controller</span></a>
          </li>
        </ul>
      </nav>
    )
  }
}

class Main extends Component {
  constructor(props){
    super(props);

    this.ftpDaemon = new FTPDaemon();

    this.state = {
      isAuth : null,
      courtID : 1,
      court : {isLive:false,isDoubles:false,currentSet:1,setCount:3,isSuperBreaker:true},
      team1 : {name:'',logo:'',setScores:[0,0,0,0,0,0]},
      team2 : {name:'',logo:'',setScores:[0,0,0,0,0,0]},
      player1 : {name:''},
      player2 : {name:''},
      player3 : {name:''},
      player4 : {name:''},
      currentTab : 'HOME'
    }
  }

  componentDidMount(){
    db.settings({
      timestampsInSnapshots: true
    });
    //this.loadActiveCourt();
    this.updateWithNewCourt(this.state.courtID)
    auth.onAuthStateChanged(() => {
      if(auth.currentUser){
        const email = auth.currentUser.email.split('@')[1].toLowerCase();
        this.setState({
          isAuth : email === 'njit.edu'
        })
      }else{
        this.setState({
          isAuth : false
        })
      }
    })      
  }

  generateNavbar = () => {
    return <Navbar court={this.state.courtID} isLive={this.state.court.isLive} currentTab={this.state.currentTab} setCurrentTab={this.setCurrentTab} />;
  }
    
  render() {
    if(this.state.isAuth === null){
      return(
        <div>
          {this.generateNavbar()}
          <div style={{textAlign:'center',marginTop:50}}><i className='fas fa-circle-notch fa-spin' style={{fontSize:80,color:'white',marginBottom:10}}></i><p style={{fontSize:20}}>Loading ...</p></div>
      </div>
      )      
    }else if(!this.state.isAuth){
      return (
        <div>
          {this.generateNavbar()}
          <Home isAuth={this.state.isAuth} signOut={this.signOut} signInWithGoogle={this.signInWithGoogle}/>
        </div>
      )
    }

    // Notify the FTP daemon that our state updated
    this.ftpDaemon.notifyCourtUpdate();

    switch(this.state.currentTab){
      case "HOME": default:
        return (
          <div>            
            {this.generateNavbar()}
            <Home isAuth={this.state.isAuth} signOut={this.signOut} signInWithGoogle={this.signInWithGoogle}/>
          </div>
        )
      case "CONTROLLER":
        return (
          <div>            
            {this.generateNavbar()}
            <Controller 
              team1={this.state.team1}
              team2={this.state.team2}
              player1={this.state.player1}
              player2={this.state.player3}
              court={this.state.court}
              isGameOver={this.isGameOver}
              resetGame={this.resetGame}
              updateScore={this.updateScore}
              updateSetScore={this.updateSetScore}
              updateCurrentSet={this.updateCurrentSet}
              />
          </div>
        )
      case "SETTINGS":
        return (
          <div>            
            {this.generateNavbar()}
            <Settings
              courtID={this.state.courtID} 
              court={this.state.court}     
              team1={this.state.team1}
              team2={this.state.team2}
              player1={this.state.player1}
              player2={this.state.player2}
              player3={this.state.player3}
              player4={this.state.player4}
              isLive={this.state.court.isLive}
              updateCourtID={this.updateCourtID}  
              updateIsDoubles={this.updateIsDoubles}
              updateTeam={this.updateTeam}
              updateSetCount={this.updateSetCount}
              updatePlayerName={this.updatePlayerName}
              updateIsSuperBreaker={this.updateIsSuperBreaker}
              updateDatabase={this.updateDatabase}
              updateLiveStreamStatus={this.updateLiveStreamStatus}
            />
          </div>
        )      
    }
  }

  signOut = () => {
    auth.signOut();
    window.location.reload();
  }

  signInWithGoogle = () => {
    auth.signInWithRedirect(GOOGLE);
  }

  setCurrentTab = (tab) => {
    this.setState({
      currentTab: tab
    })
  }

  /*
  loadActiveCourt = () => {
    db.collection('courts').doc('activeCourt').onSnapshot(doc => {
      this.setState({ 
        'courtID': doc.data().courtID,
        'isStreamLive': doc.data().isStreamLive
      },() => {
        this.updateWithNewCourt(this.state.courtID);
      })
    })
  }
  */
  
  updateWithNewCourt = (courtID) => {
    const court = db.collection('courts').doc('court'+courtID);
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

  }

  keepStateUpdated(docu,key){
    docu.onSnapshot(doc => {
      this.setState({
        [key] : doc.data()
      })
    })
  }

  convertBoolean(val){
    switch(val){
      case 'true':
        return true
      case 'false':
        return false
      default:
        return val
    }
  }

  updatePlayerName = (e,n) => {
    e.persist()
    const court = db.collection('courts').doc('court'+this.state.courtID);
    const team1 = court.collection('teams').doc('team1');
    const team2 = court.collection('teams').doc('team2');
    const player1 = team1.collection('players').doc('player1');
    const player2 = team1.collection('players').doc('player2');
    const player3 = team2.collection('players').doc('player1');
    const player4 = team2.collection('players').doc('player2');
    switch(n){
      case 1:
        player1.update({
          name: e.target.value
        })
      break;
      case 2:
        player2.update({
          name: e.target.value
        })
      break;
      case 3:
        player3.update({
          name: e.target.value
        })
      break;
      case 4:
        player4.update({
          name: e.target.value
        })
      break;
      default:
      break;
    }
  }

  updateTeam = (e,n) => {
    e.persist()
    const court = db.collection('courts').doc('court'+this.state.courtID);
    const team1 = court.collection('teams').doc('team1');
    const team2 = court.collection('teams').doc('team2');
    switch(n){
      case 1:
      team1.update({
        name: e.target[e.target.selectedIndex].text,
        logo: e.target.value
      })
      break;
      case 2:
      team2.update({
        name: e.target[e.target.selectedIndex].text,
        logo: e.target.value
      })
      break;
      default:
      break;
    }
  }
  
  updateCourtID = n => {
    this.setState({
      courtID : n
    });
    this.updateWithNewCourt(n);
    /*
    const activeCourt = db.collection('courts').doc('activeCourt');  
    activeCourt.update({
      courtID : n  
    })
    */
  }
  

  updateIsDoubles = val => {
    const court = db.collection('courts').doc('court'+this.state.courtID);
    court.update({
      isDoubles : this.convertBoolean(val)
    })
  }

  updateIsSuperBreaker = val => {
    const court = db.collection('courts').doc('court'+this.state.courtID);
    court.update({
      isSuperBreaker : this.convertBoolean(val)
    })
  }

  updateCurrentSet = (setNumber) => {
    const court = db.collection('courts').doc('court'+this.state.courtID);
    var courtObj = this.state.court;
    courtObj.currentSet = setNumber;
    this.setState({
      court: courtObj
    },() => {
      court.update({
        isDoubles: this.state.court.isDoubles,
        currentSet: this.state.court.currentSet
      })
    })
  }

  updateSetCount = (count) => {
    const court = db.collection('courts').doc('court'+this.state.courtID);
    var courtObj = this.state.court;
    courtObj.setCount = count;
    this.setState({
      court: courtObj
    },() => {
      court.update({
        setCount: this.state.court.setCount,
      })
    })
  }

  updateLiveStreamStatus = (val) => {    
    const court = db.collection('courts').doc('court'+this.state.courtID);
    court.update({
      isLive: val
    })
    if(val){
      this.setState({
        currentTab: "CONTROLLER"
      }) 
    }
  }

  getTeamMatchPoints = (teamNum) => {
    let points = 0;

    const setCount = this.state.court.setCount;
    for(var i = 1; i<6; i++){
      let T1setScore = this.state['team'+teamNum].setScores[i];
      let T2setScore = this.state['team'+(3-teamNum)].setScores[i];
      
      if(i === setCount && this.state.court.isSuperBreaker && T1setScore >= 10 && T1setScore - T2setScore >= 2){
        points++
      }else if(!(this.state.court.isSuperBreaker && i === setCount) && ((T1setScore === 6 && T1setScore - T2setScore >= 2) || T1setScore === 7)){
        points++
      }
    }
    return points;
  }

  isGameOver = () => {
    const setCount = this.state.court.setCount;
    if(this.getTeamMatchPoints(1) > setCount/2 || this.getTeamMatchPoints(2) > setCount/2){
      return true
    }
    return false
  }

  updateSetScore = (team,set,score) => {
    const court = db.collection('courts').doc('court'+this.state.courtID);
    const thisTeam = team === 'team1' ? 
                  court.collection('teams').doc('team1'):
                  court.collection('teams').doc('team2');
    const otherTeam = team === 'team1' ? 
                  court.collection('teams').doc('team2'):
                  court.collection('teams').doc('team1');
    let otherScore = 0;
    otherTeam.get().then( doc => {
      if(doc.exists){
        otherScore = doc.data().setScores[set];
        if(this.isGameOver()) return;
        if(set === this.state.court.setCount && this.state.court.isSuperBreaker && score > 10 && Math.abs(score - otherScore) > 2 && score > otherScore) return;
        if(!this.state.court.isSuperBreaker && score > 6 && otherScore < 5) return;
        var teamObj = this.state[team];
        teamObj.setScores[set] = score;
        this.setState({
          [team] : teamObj
        },() => {
          thisTeam.update({
            name: this.state[team].name,
            score: this.state[team].score,
            setScores: this.state[team].setScores
          })
          //if(score >= 6 && Math.abs(score - otherScore) >= 2 && this.state.court.currentSet < this.state.court.setCount){
          if(!this.isGameOver()){
            if(set !== this.state.court.setCount && (score === 7 || (score >= 6 && (score - otherScore) >= 2))){
              this.updateCurrentSet(set+1);
            }
          }
        })
      }else{
        console.log("Other team not found!")
      }
    });    
  }

  updateScore = (team,score) => {
    const court = db.collection('courts').doc('court'+this.state.courtID);
    const teamDB = team === 'team1' ? 
                  court.collection('teams').doc('team1') :
                  court.collection('teams').doc('team2');
    var teamObj = this.state[team];
    teamObj.score = score;
    this.setState({
      [team] : teamObj
    },() => {
      teamDB.update({
        name: this.state[team].name,
        score: this.state[team].score,
        setScores: this.state[team].setScores
      })
    })
  }

  resetGame = () => {
    const court = db.collection('courts').doc('court'+this.state.courtID);
    const team1 = court.collection('teams').doc('team1');
    const team2 = court.collection('teams').doc('team2');
    team1.update({
      score: '0',
      setScores: [0,0,0,0,0,0]
    })
    team2.update({
      score: '0',
      setScores: [0,0,0,0,0,0]
    })
  }

  updateDatabase = () => {
    //const activeCourt = db.collection('courts').doc('activeCourt');
    const court = db.collection('courts').doc('court'+this.state.courtID);
    const team1 = court.collection('teams').doc('team1');
    const team2 = court.collection('teams').doc('team2');
    const player1 = team1.collection('players').doc('player1');
    const player2 = team1.collection('players').doc('player2');
    const player3 = team2.collection('players').doc('player1');
    const player4 = team2.collection('players').doc('player2');

    /*
    activeCourt.update({
      courtID: this.state.courtID
    })
    */

    court.update({
      isDoubles: this.state.court.isDoubles,
      currentSet: this.state.court.currentSet
    })

    team1.update({
      name: this.state.team1.name,
      score: this.state.team1.score,
      setScores: this.state.team1.setScores
    })
    team2.update({
      name: this.state.team2.name,
      score: this.state.team2.score,
      setScores: this.state.team2.setScores
    })

    player1.update({
      name: this.state.player1.name
    })
    player2.update({
      name: this.state.player2.name
    })
    player3.update({
      name: this.state.player3.name
    })
    player4.update({
      name: this.state.player4.name
    })

  }

}

export default Main;
