import React, { useState, useEffect } from "react";
import RecipeDataService from "../services/RecipeService";
import { Link } from "react-router-dom";

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    retrieveRecipes();
  }, []);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveRecipes = () => {
    RecipeDataService.getAll()
      .then(response => {
        setRecipes(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteRecipe = (id) => {
    RecipeDataService.remove(id)
      .then(response => {
        retrieveRecipes();
      })
      .catch(e => {
        console.log(e);  
      });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-9 ">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              // onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-9">
        <div className="row justify-content-center">
          <h4>Recipes List</h4>
            {recipes &&
              recipes.map((recipe, index) => (
                <div className="col-md-3 mb-4">
                  
                  <div className="card h-100">
                    <img src={recipe.photo ? recipe.photo : 'cantina.png' } class="card-image img-fluid img-cover rounded-top" />
                      <div class="card-body">
                        <h5 class="card-title">{recipe.titre}</h5>
                        <p class="card-text">
                          <span>Level: </span>{recipe.niveau}<br/>
                          <span>Persons: </span>{recipe.personnes}<br/>
                          <span>Preparation Time: </span>{recipe.tempsPreparation}
                        </p>
                      </div>
                    <div class="card-footer">
                      <Link to={"/detail/" + recipe.id} className="btn btn-xs btn-secondary mx-1">
                        View
                      </Link>
                      <Link to={"/edit/" + recipe.id} className="btn btn-xs btn-primary mx-1">
                        Edit
                      </Link>
                      <button className="btn btn-xs btn-danger mt-3 mx-1" onClick={() => deleteRecipe(recipe.id)}>
                        Delete
                      </button>
                  </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};


export default RecipesList;