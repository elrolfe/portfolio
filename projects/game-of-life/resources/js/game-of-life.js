var GameOfLife = React.createClass({
   elements: [
      {
         name: "Glider",
         grid: [
            [1, 0, 0],
            [0, 1, 1],
            [1, 1, 0]
         ]
      },
      {
         name: "Space Ship",
         grid: [
            [1, 0, 0, 1, 0],
            [0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 1]
         ]
      },
      {
         name: "Blinker",
         grid: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
         ]
      },
      {
         name: "Toad",
         grid: [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
         ]
      },
      {
         name: "Beacon",
         grid: [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0]
         ]
      },
      {
         name: "Pentadecathalon",
         grid: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ]
      },
      {
         name: "Pulsar",
         grid: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ]
      },
      {
         name: "Gosper Glider Gun",
         grid:[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,],
            [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
         ]
      }
   ],
   
   getInitialState: function() {
      var GRID = this.randomGridOfSize(50, 70);
      return {
         grid: GRID, 
         columns: 70,
         rows: 50,
         generation: 1, 
         speed: 100, 
         running: true,
         wraparound: true
      };
   },
   
   neighbors: function(row, col) {
      var neighbors = 0;
      var prevRow = row - 1;
      var nextRow = row + 1;
      var prevCol = col - 1;
      var nextCol = col + 1;

      if (this.state.wraparound) {
         if (prevRow < 0)
            prevRow = this.state.rows - 1;

         if (nextRow == this.state.rows)
            nextRow = 0;

         if (prevCol < 0)
            prevCol = this.state.columns - 1;

         if (nextCol == this.state.columns)
            nextCol = 0;

         neighbors = this.state.grid[prevRow][prevCol];
         neighbors += this.state.grid[prevRow][col];
         neighbors += this.state.grid[prevRow][nextCol];
         neighbors += this.state.grid[row][prevCol];
         neighbors += this.state.grid[row][nextCol];
         neighbors += this.state.grid[nextRow][prevCol];
         neighbors += this.state.grid[nextRow][col];
         neighbors += this.state.grid[nextRow][nextCol]; 
      } else {
         if (prevRow >= 0) {
            if (prevCol >= 0)
               neighbors += this.state.grid[prevRow][prevCol];
            neighbors += this.state.grid[prevRow][col];
            if (nextCol < this.state.columns)
               neighbors += this.state.grid[prevRow][nextCol];
         }         
         
         if (prevCol >= 0)
            neighbors += this.state.grid[row][prevCol];
         if (nextCol < this.state.columns)
            neighbors += this.state.grid[row][nextCol];
         
         if (nextRow < this.state.rows) {
            if (prevCol >= 0)
               neighbors += this.state.grid[nextRow][prevCol];
            neighbors += this.state.grid[nextRow][col];
            if (nextCol < this.state.columns)
               neighbors += this.state.grid[nextRow][nextCol];
         }
      }
      return neighbors;
   },
   
   nextGeneration: function() {
      var nextGen = [];
      var liveCells = 0;

      for (var row = 0; row < this.state.rows; row++) {
         var r = [];
         for (var col = 0; col < this.state.columns; col++) {
            var neighbors = this.neighbors(row, col)
            switch (neighbors) {
               case 0:
               case 1:
                  r.push(0); // Not enough neighbors to survive
                  break;

               case 2:
                  if (this.state.grid[row][col] == 0) { // Not enough to start new life
                     r.push(0);
                     break;
                  }

               case 3:
                  r.push(1); // Enough neighbors to sustain or start life
                  liveCells++;
                  break;

               default:
                  r.push(0); // Too many neighbors to sustain life
                  break;
            }
         }
         nextGen.push(r); // Add the new row to the next generation grid
      }

      if (!liveCells)
         if (this.intervalTimer)
            clearInterval(this.intervalTimer);
      
      this.setState({grid: nextGen, generation: (liveCells > 0 ? (this.state.generation + 1) : 0), running: (liveCells ? this.state.running : false)});
   },
   
   componentDidMount: function() {
      this.intervalTimer = setInterval(this.nextGeneration, this.state.speed);
   },
   
   clearGrid: function() {
      if (this.intervalTimer)
         clearInterval(this.intervalTimer);

      var r = this.emptyGrid();
      this.setState({grid: r, generation: 0});
   },
   
   emptyGrid: function() {
      var grid=[];
      
      for (var i = 0; i < this.state.rows; i++)
         grid.push(Array(parseInt(this.state.columns)).fill(0));
                 
      return grid;
   },
   
   randomGridOfSize: function(rows, cols) {
      var grid=[];
      
      for (var i = 0; i < rows; i++) {
         var a = [];
         for (var j = 0; j < cols; j++)
            a.push(Math.floor(Math.random() * 2));
         grid.push(a);
      }
      
      return grid;
   },
   
   updateGrid: function(grid) {
      this.setState({grid: grid});
   },
   
   updateGridSize: function(rows, cols) {
      if (this.intervalTimer)
         clearInterval(this.intervalTimer);

      var grid = this.randomGridOfSize(rows, cols);
      this.setState({
         grid: grid,
         columns: cols,
         rows: rows,
         running: true
      });
      
      this.intervalTimer = setInterval(this.nextGeneration, this.state.speed);
   },
   
   updateRenderSpeed: function(speed) {
      this.setState({speed: speed});
      if (this.intervalTimer) {
         clearInterval(this.intervalTimer);
         this.intervalTimer = setInterval(this.nextGeneration, speed);
      }
   },
   
   updateRunState: function(newState) {
      this.setState({running: newState});
      if (newState) {
         if (this.intervalTimer)
            clearInterval(this.intervalTimer);
         this.intervalTimer = setInterval(this.nextGeneration, this.state.speed);
      } else if (this.intervalTimer)
         clearInterval(this.intervalTimer);
   },
   
   updateWraparound: function(newState) {
      this.setState({wraparound: newState});
   },
   
   placeElement: function(element) {     
      if (this.intervalTimer)
         clearInterval(this.intervalTimer);
      
      var e = this.elements[element].grid;
      var rowOffset = Math.floor((this.state.rows - e.length) / 2);
      var colOffset = Math.floor((this.state.columns - e[0].length) / 2);
      
      var r = this.emptyGrid();
      for (var row = 0; row < e.length; row++)
         for (var col = 0; col < e[0].length; col++)
            r[rowOffset + row][colOffset + col] = e[row][col];
      
      this.setState({grid: r, running: false, generation: 1});
   },
   
   render: function() {
      return(
         <div className="game-of-life">
            <GameTopControls 
               rows={this.state.rows}
               columns={this.state.columns}
               running={this.state.running} 
               speed={this.state.speed}
               wraparound={this.state.wraparound}
               generation={this.state.generation} 
               onClearGrid={this.clearGrid}
               onRunStateChange={this.updateRunState}
               onSizeChange={this.updateGridSize}
               onSpeedChange={this.updateRenderSpeed}
               onWrapChange={this.updateWraparound}
               onStep={this.nextGeneration}
            />
            <GameGrid grid={this.state.grid} rows={this.state.rows} columns={this.state.columns} onGridChange={this.updateGrid} />
            <GameBottomControls
               elements={this.elements}
               rows={this.state.rows}
               columns={this.state.columns}
               onButtonClick={this.placeElement}
            />
         </div>
      )
   }
});

var GameTopControls = React.createClass({
   getInitialState: function() {
      return {running: this.props.running};
   },
   
   componentWillReceiveProps: function(nextProps) {
      this.setState({running: nextProps.running});   
   },
   
   clearGrid: function() {
      this.props.onRunStateChange(false);
      this.props.onClearGrid();
      this.setState({running: false});
      
   },
   
   setNewSize: function() {
      var rows = this.rowTextField.value;
      var cols = this.colTextField.value;
      
      if (rows < 10)
         rows = 10;
      if (rows > 100)
         rows = 100;
      
      if (cols < 10)
         cols = 10;
      if (cols > 100)
         cols = 100;
      
      this.rowTextField.value = rows;
      this.colTextField.value = cols;

      this.props.onSizeChange(rows, cols); 
   },
   
   setRenderSpeed: function(e) {
      this.props.onSpeedChange(e.target.value);
   },
   
   stepGeneration: function() {
      this.props.onStep();
   },
   
   toggleRunState: function() {
      this.props.onRunStateChange(!this.state.running);
      this.setState({running: !this.state.running});
   },
   
   toggleWraparound: function() {
      this.props.onWrapChange(!this.props.wraparound);
   },
   
   render: function() {
      return(
         <div className="game-controls">
            <div>
               <label>Rows:</label>
               <input 
                  type="number" 
                  ref={function(ref) {
                     this.rowTextField = ref;
                  }.bind(this)}
                  defaultValue={this.props.rows} 
               />
               <label>Columns:</label>
               <input 
                  type="number" 
                  ref={function(ref) {
                     this.colTextField = ref;
                  }.bind(this)}
                  defaultValue={this.props.columns} 
               />
               <button onClick={this.setNewSize}>Set Size</button>
               <label>Wrap Around the Grid:</label>
               <input type="checkbox" onChange={this.toggleWraparound} checked={this.props.wraparound} />
            </div>
            <div>
               <button className={this.props.speed == 250 ? "active" : ""} id="speed-250" value="250" onClick={this.setRenderSpeed}>Slow</button>
               <button className={this.props.speed == 100 ? "active" : ""} id="speed-100" value="100" onClick={this.setRenderSpeed}>Medium</button>
               <button className={this.props.speed == 50 ? "active" : ""} id="speed-50" value="50" onClick={this.setRenderSpeed}>Fast</button>
               <div className="spacer"></div>
               <button onClick={this.toggleRunState}>{this.state.running ? "Pause" : "Run"}</button>
               <button onClick={this.clearGrid}>Clear</button>
               <button onClick={this.stepGeneration} disabled={this.state.running}>Step</button>
               <p>Generations: <span>{this.props.generation}</span></p>
            </div>
         </div>
      );
   }
});

var GameBottomControls = React.createClass({
   handleButtonClick: function(e) {
      var index = parseInt($(e.target).prop("id").substring(15));
      this.props.onButtonClick(index);
   },
   
   componentWillReceiveProps: function() {
      this.forceUpdate(); 
   },
   
   render: function() {
      var buttons = [];
      var index = 0;
      this.props.elements.forEach(function(item) {
         if (item.grid.length < this.props.rows && item.grid[0].length < this.props.columns) {
            buttons.push(<button id={"element-button-" + index} onClick={this.handleButtonClick}>{item.name}</button>);
         } else {
            buttons.push(<button disabled>{item.name}</button>);
         }
         index++;
      }.bind(this));
      
      return(
         <div className="game-controls">
            {buttons}
         </div>
      );
   }
});

var GameGrid = React.createClass({
   getInitialState: function() {
      return {grid: this.props.grid};
   },
   
   componentWillReceiveProps: function(newProps) {
      this.setState({grid: newProps.grid});
   },
   
   updateRowState(index, newRow) {
      var r = this.state.grid;
      r[index] = newRow;
      this.setState({grid: r});
      this.props.onGridChange(r);
   },
   
   render: function() {
      var rows = [];
      for (var i = 0; i < this.props.rows; i++)
         rows.push(<GameRow row={this.state.grid[i]} columns={this.props.columns} index={i} onRowChange={this.updateRowState}/>);
      
      return(
         <div className="game-grid">
            {rows}
         </div>
      )
   }
});

var GameRow = React.createClass({
   getInitialState: function() {
      return{row: this.props.row};
   },
   
   componentWillReceiveProps: function(newProps) {
      this.setState({row: newProps.row});
   },
   
   updateCellState: function(index, alive) {
      var r = this.state.row;
      r[index] = alive;
      this.setState({row: r});
      this.props.onRowChange(this.props.index, r);
   },
   
   render: function() {
      var cols = [];
      for (var i = 0; i < this.props.columns; i++)
         cols.push(<GameCell alive={this.state.row[i]} index={i} onCellClick={this.updateCellState}/>);
                      
      return(
         <div className="game-row">
            {cols}
         </div>
      );
   }
});

var GameCell = React.createClass({
   getInitialState: function() {
      return {alive: this.props.alive};
   },
   
   componentWillReceiveProps: function(newProps) {
      this.setState({alive: newProps.alive});
   },
   
   handleOnClickCell: function(e) {
      this.props.onCellClick(this.props.index, !this.state.alive);
      this.setState({alive: !this.state.alive});
   },
   
   render: function() {
      return(
         <div className={"game-cell " + (this.state.alive ? "alive" : "dead")} onClick={this.handleOnClickCell}></div>
      );
   }
});

ReactDOM.render(
   <GameOfLife />,
   document.getElementById("reaction")
);