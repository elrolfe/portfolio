function ordinal(val) {
  switch (val % 100) {
    case 11:
    case 12:
    case 13:
      return "th";
    default:
      switch (val % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
  }
}

function createDateStr(d) {
  var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var year = parseInt(d.substring(0,4));
  var month = parseInt(d.substring(5,7));
  var day = parseInt(d.substring(8,10));
  var hour = parseInt(d.substring(11,13));
  var minute = d.substring(14,16);
  var amOrPm = "AM";
  
  if (hour > 12) {
    hour -= 12;
    amOrPm = "PM";
  }
  
  if (hour === 0)
    hour == 12;
  
  return hour + ":" + minute + " " + amOrPm + ", " + months[month] + " " + day + ordinal(day) + ", " + year;
}

var TableRow = React.createClass({
  render: function() {
    return(
      <tr>
        <td>{this.props.rank}<sup>{ordinal(this.props.rank)}</sup></td>
        <td><img src={this.props.camper.img} alt={this.props.camper.username} /><a href={"https://www.freecodecamp.com/" + this.props.camper.username} target="_blank">{this.props.camper.username}</a></td>
        <td>{this.props.camper.recent}</td>
        <td>{this.props.camper.alltime}</td>
        <td>{createDateStr(this.props.camper.lastUpdate)}</td>
      </tr>
    );
  }
})

var SortableTable = React.createClass({
  getInitialState: function() {
    return {sortOn: "recent", sortDir: "desc"};
  },
  
  changeRecent: function() {
    if (this.state.sortOn != "recent")
      this.setState({sortOn: "recent", sortDir: "desc"});
    else if (this.state.sortDir == "desc")
      this.setState({sortDir: "asc"});
    else
      this.setState({sortDir: "desc"});
  },
  
  changeAlltime: function() {
    if (this.state.sortOn != "alltime")
      this.setState({sortOn: "alltime", sortDir: "desc"});
    else if (this.state.sortDir == "desc")
      this.setState({sortDir: "asc"});
    else
      this.setState({sortDir: "desc"});
  },
  
  render: function() {
    var recentClass = "sortable";
    var alltimeClass = "sortable";
    if (this.state.sortOn == "recent") {
      recentClass += " sort-" + this.state.sortDir;
      this.props.campers.sort(function(a, b) {
        if (this.state.sortDir == "desc")
          return b.recent - a.recent;
        else
          return a.recent - b.recent;
      }.bind(this));
    } else {
      alltimeClass += " sort-" + this.state.sortDir;
      this.props.campers.sort(function(a, b) {
        if (this.state.sortDir == "desc")
          return b.alltime - a.alltime;
        else
          return a.alltime - b.alltime;
      }.bind(this));
    }
    
    var rows = [];
    var rank = this.state.sortDir == "desc" ? 1 : this.props.campers.length;
    this.props.campers.forEach(function(camper) {
      rows.push(<TableRow camper={camper} rank={rank} key={camper.username} />);
      rank += this.state.sortDir == "desc" ? 1 : -1;
    }.bind(this));
    
    return(
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th className={recentClass}><a href="#" onClick={this.changeRecent}>Points in Last 30 Days</a></th>
            <th className={alltimeClass}><a href="#" onClick={this.changeAlltime}>All Time Points</a></th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var LeaderBoard = React.createClass({
  getInitialState: function() {
    return {board: "recent", campers: []}
  },
  loadBoardFromServer: function() {
    var url;
    if (this.state.board == "recent")
      url = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
    else
      url = "https://fcctop100.herokuapp.com/api/fccusers/top/alltime";
    $.ajax({
      url: url,
      dataType: "json",
      type: "GET",
      success: function(data) {
        this.setState({campers: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }
    });
  },
  changeBoard: function() {
    var url = $("input[type='radio']:checked").prop("id");
    this.setState({board: url});
    this.loadBoardFromServer();
  },
  componentDidMount: function() {
    this.loadBoardFromServer();
  },
  render: function() {
    return(
      <div className="leaderboard">
        <p className="title">FreeCodeCamp - Camper Leaderboard</p>
        <p>
          <input type="radio" name="listType" value="recent" id="recent" onClick={this.changeBoard} defaultChecked />
          <label htmlFor="recent">Top 100 Campers in Last 30 Days</label>
          <input type="radio" name="listType" value="alltime" id="alltime" onClick={this.changeBoard} />
          <label htmlFor="alltime">All Time Points</label>
        </p>
        <SortableTable campers={this.state.campers} />
      </div>
    );
  }
});

ReactDOM.render(
  <LeaderBoard />,
  document.getElementById("reaction")
);