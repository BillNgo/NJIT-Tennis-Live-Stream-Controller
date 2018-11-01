import React, { Component } from 'react';

class Team extends Component {
  render(){
    var color = this.props.color
    //var color2 = this.props.color2
    return (    
    <div className='col-sm-6 mb-3 mt-0'>
      
      <label style={{color:color}}>Team</label>

      <div className="input-group mb-0">
        <div className="input-group-prepend">
          <div className="input-group-text" style={{fontFamily:'Syncopate',fontWeight:'bold',backgroundColor:'transparent',borderColor:color,color:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}}><i style={{color:color}} className="fas fa-flag"></i></div>
        </div>
        <input style={{fontWeight:'bold',fontSize:20,borderColor:color,color:color,backgroundColor:'transparent',borderWidth:0,borderBottomWidth:1,borderRadius:0}} type="text" className="form-control" placeholder="Team Name" value={this.props.team.name} onChange={this.props.handleChangeTeamName} />
      </div>

      <label style={{color:color}} className='mt-3'>Players</label>
      
      <div className="input-group mb-1">
        <div className="input-group-prepend">
          <div className="input-group-text" style={{backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}}><i style={{color:color}} className="fas fa-user"></i></div>
        </div>
        <input type="text" className="form-control" style={{color:color,backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}} placeholder="Player 1" aria-label="Input group example" aria-describedby="btnGroupAddon" value={this.props.player1.name} onChange={this.props.handleChangePlayer1Name}/>
      </div>

      <div className={this.props.isDoubles ? 'input-group' : 'd-none'}>
        <div className="input-group-prepend">
          <div className="input-group-text" style={{backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}}><i style={{color:color}} className="fas fa-user"></i></div>
        </div>
        <input type="text" className="form-control" style={{color:color,backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}} placeholder="Player 2" aria-label="Input group example" aria-describedby="btnGroupAddon" value={this.props.player2.name} onChange={this.props.handleChangePlayer2Name} />
      </div>
      
    </div>
    )
  }
}

class Settings extends Component{
  handleCourtClick = () => {
    const num = this.props.courtID;
    this.props.updateCourtID(num === 4 ? 1 : num + 1);
  }
  render(){
    return(
      <div className='container'>
        <p hidden className="text-info">Note: Changes are saved automatically!</p>
        <table className="text-center mx-auto mb-3" style={{userSelect:'none'}}>
          <tbody>
            <tr>
              <td style={{verticalAlign:'top',padding:10,cursor:'pointer',width:90}}>
                <div style={{fontSize:14}}>COURT</div>
                <div style={{fontSize:50,border:'1px solid grey',borderRadius:10}} onClick={this.handleCourtClick}>{this.props.courtID}</div>
              </td>
              <td style={{verticalAlign:'top',padding:10,cursor:'pointer',width:90}}>
                <div style={{fontSize:14}}>{ this.props.court.isDoubles ? 'DOUBLES' : 'SINGLES'}</div>
                <i onClick={() => this.props.updateIsDoubles(!this.props.court.isDoubles)} className={"fas " + ( this.props.court.isDoubles ? "fa-user-friends" : "fa-user")} style={{fontSize:40,padding:20,paddingBottom:15,border:'1px solid grey',borderRadius:10}}></i>
              </td>
              <td style={{verticalAlign:'top',padding:10,cursor:'pointer',width:90}}>
                <div style={{fontSize:14}}>BEST OF</div>
                <div onClick={() => this.props.updateSetCount(this.props.court.setCount === 3 ? 5 : 3)} style={{fontSize:50,border:'1px solid grey',borderRadius:10}}>{this.props.court.setCount}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div hidden className='row'> 
          <div className='col-12 col-sm-6 mb-2'>
          <label>Court Number</label>
            <select
              id='courtID'
              name="courtID"
              className='custom-select'
              onChange={this.props.updateCourtID}
              value={this.props.courtID}
              >
              <option value="court1">Court One</option>
              <option value="court2">Court Two</option>
              <option value="court3">Court Three</option>
              <option value="court4">Court Four</option>
            </select>
          </div>

          <div className='col-12 col-sm-6 mb-2'>
          <label>Match Type</label>
            <select
              className='custom-select'
              onChange={this.props.updateIsDoubles}
              value={this.props.court.isDoubles}>
              <option value={false}>Singles</option>
              <option value={true}>Doubles</option>
            </select>
          </div>
        </div>


        <div className='row'>
          <Team 
          team={this.props.team1}
          player1={this.props.player1}
          player2={this.props.player2}
          isDoubles={this.props.court.isDoubles}
          color='#4285F4'
          color2='#e3f2fd'
          handleChangeTeamName={(e) => this.props.updateTeamName(e,1)}
          handleChangePlayer1Name={(e) => this.props.updatePlayerName(e,1)}
          handleChangePlayer2Name={(e) => this.props.updatePlayerName(e,2)}/>
          <Team 
          team={this.props.team2}
          player1={this.props.player3}
          player2={this.props.player4}
          isDoubles={this.props.court.isDoubles}
          color='#ff4444' 
          color2='#ffebee'
          handleChangeTeamName={(e) => this.props.updateTeamName(e,2)}
          handleChangePlayer1Name={(e) => this.props.updatePlayerName(e,3)}
          handleChangePlayer2Name={(e) => this.props.updatePlayerName(e,4)}/>
        </div>

        <button className='btn btn-lg btn-dark col mt-3 mb-5'
                onClick={() => this.props.updateLiveStreamStatus(!this.props.isLive)}>{this.props.isLive ? 'END' : 'START'} LIVE STREAM
        <i className="fas fa-circle text-danger ml-1"></i>
        </button>
      </div>
    )
  }
}

export default Settings;