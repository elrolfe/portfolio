var RecipeBox = React.createClass({
   getInitialState: function() {
      this.recipeStorageKey = "_elrolfe_recipes";
      return {recipes: []};   
   },
   
   newRecipe: function() {
      var r = [{name: "New Recipe", ingredients: ""}].concat(this.state.recipes);
      this.saveRecipes(r);
   },
   
   updateRecipe: function(index, name, ingredients) {
      var r = this.state.recipes;
      r[index].name = name;
      r[index].ingredients = ingredients;
      this.saveRecipes(r);
   },
   
   removeRecipe: function(index) {
      var r = this.state.recipes;
      this.saveRecipes(r.slice(0, index).concat(r.slice(index + 1)));
   },
   
   saveRecipes: function(recipes) {
      localStorage.setItem(this.recipeStorageKey, JSON.stringify(recipes));
      this.setState({recipes: recipes});
   },
   
   componentDidMount: function() {
      var recipes = localStorage.getItem(this.recipeStorageKey);
      if (recipes)
         this.setState({recipes: JSON.parse(recipes)});
   },
   
   render: function() {
      var rows = [];
      if (this.state.recipes.length === 0) {
         rows.push(
         <div 
            id="recipe-none" 
            className="recipe panel panel-info">
            <a 
               href="#recipe-body-none" 
               className="panel-info" 
               data-toggle="collapse" 
               data-parent="#recipe-list">
               <div className="panel-heading">
                  <h4 className="panel-title">No Recipes</h4>
               </div>
            </a>
            <div 
               id="recipe-body-none"
               className="panel-collapse collapse in">
               <div className="panel-body">
                  <p>There are no recipes in your box!  To add a new recipe, click the blue "New Recipe" button in the upper right.</p>
               </div>
            </div>
         </div>
         );
      } else {
         for (var i = 0; i < this.state.recipes.length; i++) {
            rows.push(<RecipeCard recipe={this.state.recipes[i]} index={i} onRecipeChange={this.updateRecipe} onRemoveRecipe={this.removeRecipe}/>);
         }
      }
      return (
         <div className="recipe-box">
            <nav className="navbar navbar-default navbar-fixed-top">
               <div className="container">
                  <a className="navbar-brand" href="https://freecodecamp.com" target="_blank">FreeCodeCamp</a>
                  <button type="button" id="new-recipe" className="btn btn-primary navbar-btn navbar-right" onClick={this.newRecipe}>
                     <span className="glyphicon glyphicon-plus"></span> New Recipe
                  </button>
               </div>
            </nav>
            <div className="container">
               <div className="well panel-group" id="recipe-list">
                  {rows}
               </div>
            </div>
         </div>
      );
   }
});

var RecipeCard = React.createClass({
   getInitialState: function() {
      return {name: this.props.recipe.name, ingredients: this.props.recipe.ingredients};   
   },
   
   componentWillReceiveProps: function(nextProp) {
      this.setState({name: nextProp.recipe.name, ingredients: nextProp.recipe.ingredients});
   },
   
   updateIngredientState: function(newIngredients) {
      this.setState({ingredients: newIngredients});
      this.props.onRecipeChange(this.props.index, this.state.name, newIngredients);
   },
   
   startEditingName: function(e) {
      $(e.target).hide();
      $(e.target).siblings(".editable").attr("contenteditable", true).focus();

      var elementID = $(e.target).siblings(".editable").prop("id");
      var textNode = document.getElementById(elementID).firstChild;
      var textLength = $("#" + elementID).text().length;
      var range = document.createRange();
      range.setStart(textNode, textLength);
      range.setEnd(textNode, textLength);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
   },

   editNameHandleKeyDown: function(e) {
      if (e.key == "Enter") {
         e.preventDefault();
         e.stopPropagation();
         $(e.target).blur();
      }
   },
   
   editNameHandleBlur: function(e) {
      $(e.target).text($(e.target).text().replace(/\n/g, ""));
      $(e.target).attr("contenteditable", false);
      $(e.target).siblings(".glyphicon-pencil").show();
      this.setState({name: $(e.target).text()});
      this.props.onRecipeChange(this.props.index, $(e.target).text(), this.state.ingredients);
   },
   
   removeRecipe: function() {
      this.props.onRemoveRecipe(this.props.index);
   },
   
   render: function() {
      return (
         <div 
            id={"recipe-" + this.props.index} 
            className="recipe panel panel-info">
            <a 
               href={"#recipe-body-" + this.props.index} 
               className="panel-info" 
               data-toggle="collapse" 
               data-parent="#recipe-list">
               <div className="panel-heading">
                  <h4 className="panel-title">{this.state.name}</h4>
               </div>
            </a>
            <div 
               id={"recipe-body-" + this.props.index}
               className={"panel-collapse collapse" + (this.props.index == 0 ? " in" : "")}>
               <div className="panel-body">
                  <button className="btn btn-danger pull-right" onClick={this.removeRecipe}>
                     <span className="glyphicon glyphicon-remove"></span> Delete
                  </button>
                  <h2>
                     <span 
                        className="editable" 
                        id={"name-" + this.props.index}
                        onKeyDown={this.editNameHandleKeyDown}
                        onBlur={this.editNameHandleBlur}
                        >
                        {this.state.name} 
                     </span> <span className="glyphicon glyphicon-pencil" onClick={this.startEditingName}></span>
                  </h2>
                  <h3>Ingredients:</h3>
                  <IngredientList ingredients={this.state.ingredients} index={this.props.index} onIngredientChange={this.updateIngredientState} />
               </div>
            </div>
         </div>
      );
   }
});

var IngredientList = React.createClass({
   getInitialState: function() {
      return {ingredients: this.props.ingredients};
   },
   
   componentWillReceiveProps: function(nextProps) {
     this.setState({ingredients: nextProps.ingredients}) ;
   },
   
   updateIngredientState: function(newIngredients) {
      this.setState({ingredients: newIngredients});
      this.props.onIngredientChange(newIngredients);
   },
   
   removeIngredient: function(e) {
      var index = parseInt($(e.target).parent().parent().prop("id").substring(11));
      var items = this.state.ingredients.split(",");
      var newItems = items.slice(0, index).concat(items.slice(index + 1));
      this.updateIngredientState(newItems.join(","));
   },
   
   handleKeyDownIngredients: function(e) {
      if (e.key == "Enter") {
         e.preventDefault();
         e.stopPropagation();
         $(e.target).blur();
      }      
   },
   
   handleBlurIngredients: function(e) {
      $(e.target).hide();
      $(e.target).siblings(".ingredients").removeClass("no-remove");
      $(e.target).siblings(".edit-ingredients").show();
      this.updateIngredientState($(e.target).val().trim());
   },
   
   handleOnChangeIngredients: function(e) {
      this.updateIngredientState($(e.target).val().trim());
   },
   
   startUpdatingIngredients: function(e) {
      $(e.target).hide();
      $(e.target).siblings(".ingredients").addClass("no-remove");
      $(e.target).siblings(".ingredient-list").val(this.state.ingredients).show().focus();
   },
   
   render: function() {
      var rows = [];
      var items = this.state.ingredients.split(",");
      if (items.length == 1 && items[0] == "") {
         rows.push(<p>No ingredients</p>);
      } else {
         for (var i = 0; i < items.length; i++) {
            rows.push(
               <div className="ingredient" id={"ingredient-" + i}>
                  <button className="remove-ingredient" onClick={this.removeIngredient}>
                     <span className="glyphicon glyphicon-remove"></span>
                  </button>{items[i].trim()}
               </div>
            )   
         }
      }
      
      return(
         <div className="ingredient-wrapper">
            <input type="text" className="ingredient-list" placeholder="Ingredient List (Comma Separated)" onChange={this.handleOnChangeIngredients} onKeyDown={this.handleKeyDownIngredients} onBlur={this.handleBlurIngredients}/>
            <div className="ingredients" id={"ingredients-" + this.props.index}>
               {rows}
            </div>
            <button className="btn btn-info edit-ingredients" onClick={this.startUpdatingIngredients}>
               <span class="glyphicon glyphicon-plus"></span> Edit Ingredients
            </button>
         </div>
      )
   }
})

ReactDOM.render(
   <RecipeBox />,
   document.getElementById("reaction")
);