import React, { Component } from 'react';

const scoreStyle = {
  fontSize:40,
  fontFamily:'Syncopate'
}

class Controller extends Component {
  constructor(props){
    super(props);
    this.state = {
      settingsOpen: false
    }
  }

  updateScore = (forTeam1 = true, adding = true) => {
    const aTeam = forTeam1 ? 'team1' : 'team2';
    const bTeam = forTeam1 ? 'team2' : 'team1';

    const T1score = this.props[aTeam].score;
    const T2score = this.props[bTeam].score;

    const currentSet = this.props.court.currentSet;
    const setCount = this.props.court.setCount;

    const setScore1 = this.props['team1'].setScores[currentSet];        
    const setScore2 = this.props['team2'].setScores[currentSet];

    if(this.props.isGameOver() || currentSet > setCount) return;

    if(setCount === currentSet){

      // THIRD SET TIE BREAKER SCORING
      // logic handled in updateSetScore in Main.js

      const T1num = parseInt(T1score,10) + (adding ? 1 : -1)
      const newScore = T1num.toString()

      this.props.updateScore(aTeam,newScore)
      this.props.updateSetScore(aTeam,currentSet,newScore)

    }else if(setScore1 === 6 && setScore2 === 6){

      // SET TIE BREAKER SCORING

      const T1num = parseInt(T1score,10) + (adding ? 1 : -1)
      const T2num = parseInt(T2score,10)

      if(T1num >= 7 && Math.abs(T1num - T2num) >= 2){
        this.props.updateSetScore(aTeam,currentSet,this.props[aTeam].setScores[currentSet]+1)
        this.props.updateScore(aTeam,'0')
        this.props.updateScore(bTeam,'0')
      }else{
        const newScore = T1num.toString()
        this.props.updateScore(aTeam,newScore)
      }  
      
    }else{

      // NORMAL GAMEPLAY SCORING

      switch(T1score){
        case '0':        
          this.props.updateScore(aTeam,adding?'15':'0')
          break;
        case '15':
          this.props.updateScore(aTeam,adding?'30':'0')
          break;
        case '30':
          this.props.updateScore(aTeam,adding?'40':'15')
          break;
        case '40':
          this.props.updateScore(aTeam,adding?'0':'30')
          if(adding){
            this.props.updateSetScore(aTeam,currentSet,this.props[aTeam].setScores[currentSet]+1)
            this.props.updateScore(bTeam,'0')
          }
          break;
        default:
          this.props.updateScore(aTeam,'0')
          break;
      }
          
    }
    /*
      if(T1score === '40' && T2score === '40'){
        // advantage
        this.props.updateScore(aTeam,adding?'adv':'30')
      }
      else if(T1score === '40' && T2score === 'adv'){
        // duece
        this.props.updateScore(bTeam,adding?'40':'adv')
      }
      else if(T1score === '40' && T2score !== '40'){
        // T1 wins set
        this.props.updateScore(aTeam,adding?'0':'30')
        if(adding){
          this.props.updateSetScore(aTeam,currentSet,this.props[aTeam].setScores[currentSet]+1)
          this.props.updateScore(bTeam,'0')
        }
      }else if(T1score === 'adv'){
        // T1 wins set
        this.props.updateScore(aTeam,adding?'0':'40')
        if(adding){
          this.props.updateSetScore(aTeam,currentSet,this.props[aTeam].setScores[currentSet]+1)
          this.props.updateScore(bTeam,'0')
        }
      }
    */
  }

  render(){
    return(
      <div className="container">        
      
      {this.generateSetTitle()}

      <table><tbody>
        {this.createSetScores()}
      </tbody>
      </table>
            
        <div className="row text-center my-5">
          
          {this.generateScoreTitle()}

          <div className="col-6">
            <div>{this.props.team1.name}</div>
            <div style={scoreStyle}>{this.props.team1.score}</div>
            <button className="col btn btn-lg btn-secondary" onClick={() => this.updateScore()} style={{height:60}}>
              <i className="fas fa-plus"></i>
            </button>
            <button className="col btn btn-sm btn-dark mt-2" onClick={() => this.updateScore(true,false)}>
              <i className="fas fa-minus"></i>
            </button>
          </div>   

          <div className="col-6">
            <div>{this.props.team2.name}</div>
            <div style={scoreStyle}>{this.props.team2.score}</div>
            <button className="col btn btn-lg btn-secondary" onClick={() => this.updateScore(false)} style={{height:60}}>
              <i className="fas fa-plus"></i>
            </button>
            <button className="col btn btn-sm btn-dark mt-2" onClick={() => this.updateScore(false,false)}>
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>

        <div className="text-right">
          <a style={{color:'grey',textDecoration:'underline',cursor:'pointer'}}
              onClick={() => this.setState({ 'settingsOpen' : !this.state.settingsOpen })}>advanced settings</a>
        </div>
        
        <div className={"mt-3 "+(this.state.settingsOpen ? "d-block" : "d-none")}>
          <button className="col btn btn-lg btn-danger" onClick={this.resetGame}>Reset Game</button>
        </div>

      </div>
    )
  }

  resetGame = () => {
    this.props.updateCurrentSet(1)
    this.props.resetGame()
  }

  generateSetTitle = () => {
    if(this.props.isGameOver()){
      return (
        <div style={{fontSize:45}}>
          GAME OVER
        </div>
      );
    }else{
      return (
        <div style={{fontSize:45}}>
          SET {Math.min(this.props.court.currentSet,this.props.court.setCount)}
        </div>
      );
    }
  }

  generateScoreTitle = () => {
    const currentSet = this.props.court.currentSet;
    const setCount = this.props.court.setCount;
    const setScore1 = this.props['team1'].setScores[currentSet];        
    const setScore2 = this.props['team2'].setScores[currentSet];
    
    if(currentSet === setCount || (setScore1 === 6 && setScore2 === 6)){
      return (      
        <div className="col-12 mb-3 text-danger">
          {currentSet === setCount ? "MATCH WINNING TIE BREAKER" : "TIE BREAKER"}
        </div>
      );
    }else{
      return (      
        <div className="col-12 mb-3 text-info">
          GAME SCORE
        </div>
      );
    }
  }

  createSetScores = () => {
    const tdStyle = {
      textAlign:'center',
      width:20,
      height:20,      
      fontSize:16,
      lineHeight:0,
      paddingRight:10
    }

    const teamStyle = {
      textAlign:'left',
      width:20,
      height:20,      
      fontSize:16,
      lineHeight:0,
      paddingRight:10
    }

    let table = []

    for(let team = 1; team <= 2; team++){
      let children = []
      const currentSet = this.props.court.currentSet;
      const setCount = this.props.court.setCount;
      for(let i = 0; i <= Math.min(currentSet, setCount); i++){
        if(i === 0){
          children.push(<td key={i} style={teamStyle}>
            <span style={team === 1 ? {color:'#4285F4'} : {color:'#ff4444'}}>{this.props['team'+team].name}</span></td>);
          continue;
        }
        let score1 = this.props['team'+team].setScores[i];        
        let score2 = this.props['team'+(3-team)].setScores[i];
        children.push(<td key={i} style={tdStyle}>
          <span style={ (i >= setCount && score1 >= 10 && score1 - score2 >= 2) ||
                        ((i < setCount && score1 >= 6 && score1 - score2 >= 2) || score1 === 7) ? 
                        team === 1 ? {color:'#4285F4'} : {color:'#ff4444' } 
                      : {color:'lightgrey'}} >{score1}</span></td>)
      }
      table.push(<tr key={team}>{children}</tr>)
    }
    return table;
  }

}

export default Controller;