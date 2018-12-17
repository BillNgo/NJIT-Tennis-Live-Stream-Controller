import firebase from './firebase';
const db = firebase.firestore();

export default class FTPDaemon {
  sendTimer = null;

  notifyCourtUpdate() {
    this.scheduleSend();
  }

  // Scores should be sent, at most, every 5 seconds
  scheduleSend() {
    if (!this.sendTimer) {
      this.sendTimer = setTimeout(() => {
        this.sendScores();
        this.sendTimer = null;
      }, 5000);
    }
  }

  getDateString() {
    const date = new Date();

    return `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }


  getCourtXmlString(courtId, court) {
    return `
<Match
  type="${court.isDoubles ? 'Doubles' : 'Singles'}
  index="${courtId}"
  pos="Court ${courtId}"
  court="${courtId}"
  homeTeam="${court.teams[0].name}"
  awayTeam="${court.teams[1].name}"
  status="In Progress"
  currGameHomeScore="${court.teams[0].score}"
  currGameAwayScore="${court.teams[1].score}"
  serving=" "
  winner="H"
>
  
  <PlayerH1 displayName="${court.teams[0].players[0].name}" serving=" " year="" age="" height="" weight="" />

  ${
    court.isDoubles ?
      `<PlayerH2 displayName="${court.teams[0].players[1].name}" serving=" " year="" age="" height="" weight="" />`
    :
      ''
  }
 
  <PlayerA1 displayName="${court.teams[1].players[0].name}" serving=" " year="" age="" height="" weight="" />

  ${
    court.isDoubles ?
      `<PlayerA2 displayName="${court.teams[1].players[1].name}" serving=" " year="" age="" height="" weight="" />`
    :
      ''
  }

  ${
    (() => {
      let output = '';

      for (let i=1;i<5;++i) {
        const homeGamesWon = court.teams[0].setScores[i] || ' ';
        const awayGamesWon = court.teams[1].setScores[i] || ' ';

        output += `
  <Set num="${i}" homeGamesWon="${homeGamesWon}" awayGamesWon="${awayGamesWon}" />
        `;
      }

      return output;
    })()
  }

</Match>
    `;
  }

  async sendScores() {
    // Generate scores XML :)
    let promises = [];
    for (let n=1;n<=4;++n) {
      promises.push(async () => {
        let court = db.collection('courts').doc('court' + n);

        let teams = ['team1', 'team2'].map(name => {
          let team = court.collection('teams').doc(name);

          team.players = Array(2).fill(undefined).map((_,n) => team.collection('players').doc('player' + (n + 1)));

          return team;
        });

        return {
          teams: await Promise.all(teams.map(async t => ({
            players: (await Promise.all(
              t.players.map(p => p.get())
            )).map(r => r.data()),

            ...(await t.get()).data()
          }))),

          ...(await court.get()).data()
        };
      });
    }

    let courtStates = {
      ...await Promise.all(promises.map(f => f()))
    };

    console.log(courtStates);

    const xmlString = `
<?xml version="1.0" encoding="ISO-8859-1"?>
<DakTennis version="3.1.0.0">
  <Competition type="Dual" homeScore="0" awayScore="0" date="${this.getDateString()}">
    <Matches>
    ${Object.entries(courtStates).map(([a, b]) => this.getCourtXmlString(a, b)).reduce((a, b) => a + b)}
    </Matches>
  </Competition>
</DakTennis>
    `;

    console.log(xmlString);

    // TODO: Fire off request to GCP cloud function to proxy xml string to FTP
  }
}
