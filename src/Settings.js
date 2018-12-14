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
        <select
          className="custom-select" 
          defaultValue=""
          value={this.props.team.logo} 
          onChange={this.props.handleChangeTeam}
          style={{fontWeight:'bold',fontSize:20,borderColor:color,color:color,backgroundColor:'transparent',borderWidth:0,borderBottomWidth:1,borderRadius:0}}>
          
          <option value="">None</option>
          <option value="ArmyWestPoint.png">Army West Point</option>
          <option value="Binghamton.png">Bing Hamton</option>
          <option value="Brown.png">Brown</option>
          <option value="Bryant.png">Bryant</option>
          <option value="Drexel.png">Drexel</option>
          <option value="Fairfield.png">Fairfield</option>
          <option value="FairleighDickinsonUniversity.png">Fairleigh Dickinson</option>
          <option value="FloridaGulfCoast.png">Florida Gulf Coast</option>
          <option value="Fordham.png">Fordham</option>
          <option value="Hofstra.png">Hofstra</option>
          <option value="Jacksonville.png">Jacksonville</option>
          <option value="Kennesaw.png">Kennesaw</option>
          <option value="LehighUniversity.png">Lehigh</option>
          <option value="LibertyUniversity.png">Liberty</option>
          <option value="Libscomb.png">Libscomb</option>
          <option value="LIUBrooklyn.png">LIU Brooklyn</option>
          <option value="Marist.png">Marist</option>
          <option value="Navy.png">Navy</option>
          <option value="NJIT.png">NJIT</option>
          <option value="NorthAlabama.png">North Alabama</option>
          <option value="NorthFlorida.png">North Florida</option>
          <option value="PennState.png">Penn State</option>     
          <option value="Princeton.png">Princeton</option>
          <option value="SacredHeart.png">Sacred Heart</option>
          <option value="SetonHall.png">Seton Hall</option>
          <option value="Stetson.png">Stetson</option>
          <option value="StJohns.png">St Johns</option>
          <option value="StonyBrook.png">Stony Brook</option>
          <option value="UPenn.png">UPenn</option>
        </select>
      </div>
      
      <label style={{color:color}} className='mt-3'>Players</label>
      
      <div className="input-group mb-1">
        <div className="input-group-prepend">
          <div className="input-group-text" style={{backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}}><i style={{color:color}} className="fas fa-user"></i></div>
        </div>
        <input type="text" className="form-control" style={{color:color,backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}} placeholder="Player 1" aria-label="Input group example" aria-describedby="btnGroupAddon" value={this.props.player1.name} onChange={this.props.handleChangePlayer1Name}  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
      </div>

      <div className={this.props.isDoubles ? 'input-group' : 'd-none'}>
        <div className="input-group-prepend">
          <div className="input-group-text" style={{backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}}><i style={{color:color}} className="fas fa-user"></i></div>
        </div>
        <input type="text" className="form-control" style={{color:color,backgroundColor:'transparent',borderColor:color,borderWidth:0,borderBottomWidth:1,borderRadius:0}} placeholder="Player 2" aria-label="Input group example" aria-describedby="btnGroupAddon" value={this.props.player2.name} onChange={this.props.handleChangePlayer2Name}  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
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
        
        {/*
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
                <div style={{fontSize:14}}>{ this.props.court.isSuperBreaker ? 'LAST SET' : 'LAST SET'}</div>
                <i onClick={() => this.props.updateIsSuperBreaker(!this.props.court.isSuperBreaker)} className={( this.props.court.isSuperBreaker ? "fas fa-balance-scale" : "")} style={{fontSize:40,padding:20,paddingBottom:15,border:'1px solid grey',borderRadius:10}}>{this.props.court.isSuperBreaker ? "" : "3"}</i>
              </td>
            </tr>
          </tbody>
        </table>
        */}

        <div className='row mb-5'> 
          <div className='col-12 col-sm-4 mb-2'>
            <label>Court Number</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text" style={{backgroundColor:'transparent',borderColor:'lightgrey',borderWidth:0,borderBottomWidth:1,borderRadius:0}}>
                  <span className="fa-stack fa-1x" style={{height:16,width:14,marginBottom:7}}>
                    <i style={{color:'lightgrey'}} className="fas fa-square fa-stack-1x"></i>
                    <span style={{fontSize:14,fontWeight:1000}} className="fa-stack-1x">{this.props.courtID}</span>
                  </span>
                </div>
              </div>
              <select
                id='courtID'
                name="courtID"
                className='custom-select'
                onChange={(e) => this.props.updateCourtID(e.target.value)}
                value={this.props.courtID}
                style={{fontSize:20,borderColor:'lightgrey',color:'lightgrey',backgroundColor:'transparent',borderWidth:0,borderBottomWidth:1,borderRadius:0}}>
                >
                <option value={1}>Court One</option>
                <option value={2}>Court Two</option>
                <option value={3}>Court Three</option>
                <option value={4}>Court Four</option>
              </select>
            </div>
          </div>

          <div className='col-12 col-sm-4 mb-2'>
          <label>Match Type</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text" style={{backgroundColor:'transparent',borderColor:'lightgrey',borderWidth:0,borderBottomWidth:1,borderRadius:0}}>
                  <i style={{color:'lightgrey'}} className={"fas " + ( this.props.court.isDoubles === true ? "fa-user-friends" : "fa-user")}></i>
                </div>
              </div>
              <select
                className='custom-select'
                onChange={(e) => this.props.updateIsDoubles(e.target.value)}
                value={this.props.court.isDoubles}
                style={{fontSize:20,borderColor:'lightgrey',color:'lightgrey',backgroundColor:'transparent',borderWidth:0,borderBottomWidth:1,borderRadius:0}}>
                >
                <option value={false}>Singles</option>
                <option value={true}>Doubles</option>
              </select>
            </div>
            
          </div>

          <div className='col-12 col-sm-4 mb-2'>
          <label>Last Set Rules</label>
          <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text" style={{backgroundColor:'transparent',borderColor:'lightgrey',borderWidth:0,borderBottomWidth:1,borderRadius:0}}>
                  <i style={{color:'lightgrey'}} className="fas fa-book"></i>
                </div>
              </div>
              <select
                className='custom-select'
                onChange={(e) => this.props.updateIsSuperBreaker(e.target.value)}
                value={this.props.court.isSuperBreaker}
                style={{fontSize:20,borderColor:'lightgrey',color:'lightgrey',backgroundColor:'transparent',borderWidth:0,borderBottomWidth:1,borderRadius:0}}>
                >
                <option value={false}>Normal Set</option>
                <option value={true}>Super Breaker</option>
              </select>
              </div>
          </div>
        </div>


        <div className='row'>
          <div className="col-6 mb-2 text-center">
            <img alt="" className={this.props.team1.logo === "" ? "d-none" :  ""} src={"/img/School Logos/"+this.props.team1.logo} style={{height:100,width:'auto'}} />
          </div>
          <div className="col-6 mb-2 text-center">
            <img alt="" className={this.props.team2.logo === "" ? "d-none" :  ""} src={"/img/School Logos/"+this.props.team2.logo} style={{height:100,width:'auto'}} />
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
          handleChangeTeam={(e) => this.props.updateTeam(e,1)}
          handleChangePlayer1Name={(e) => this.props.updatePlayerName(e,1)}
          handleChangePlayer2Name={(e) => this.props.updatePlayerName(e,2)}/>
          <Team 
          team={this.props.team2}
          player1={this.props.player3}
          player2={this.props.player4}
          isDoubles={this.props.court.isDoubles}
          color='#ff4444' 
          color2='#ffebee'
          handleChangeTeam={(e) => this.props.updateTeam(e,2)}
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