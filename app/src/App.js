import React from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import RecipeDetail from "./components/RecipeDetail";
import RecipesList from "./components/RecipesList";
import RecipeForm from "./components/Form/RecipeForm";
import { Alert } from './components/Alert/Alert';
import { Navigation } from './components/Navigation/Navigation';

function App() {
  return (
    <div  style={{ backgroundImage: `url("bg.jpeg")` }}>
      <Navigation />
      <Alert />
      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/recipes"]} component={RecipesList} />
          <Route path="/add" component={RecipeForm} />
          <Route path="/edit/:id" component={RecipeForm} />
          <Route path="/detail/:id" component={RecipeDetail} />
        </Switch>
      </div>
    </div>
  );
}

export default App;