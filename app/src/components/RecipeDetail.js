import React, { useState, useEffect } from "react";
import RecipeDataService from "../services/RecipeService";
import { Link } from "react-router-dom";

const RecipeDetail = props => {
  const initialRecipeState = {
    id: null,
    titre: "",
    description: "",
    niveau: "",
    personnes:"",
    tempsPreparation:"",
    ingredients: [[{qty: 1, name: ""}]],
    etapes: [],
    photo:"",
  };
  const [currentRecipe, setCurrentRecipe] = useState(initialRecipeState);
  const [message, setMessage] = useState("");

  const getRecipe = id => {
    RecipeDataService.get(id)
      .then(response => {
        setCurrentRecipe(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getRecipe(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentRecipe({ ...currentRecipe, [name]: value });
  };

  const updatePublished = status => {
    var data = {
      id: currentRecipe.id,
      title: currentRecipe.titre,
      description: currentRecipe.description,
      niveau: currentRecipe.niveau,
      personnes: currentRecipe.personnes,
      tempsPreparation: currentRecipe.tempsPreparation,
      ingredients: currentRecipe.ingredients,
      etapes: currentRecipe.etapes

    };

    RecipeDataService.update(currentRecipe.id, data)
      .then(response => {
        setCurrentRecipe({ ...currentRecipe, published: status });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateRecipe = () => {
    RecipeDataService.update(currentRecipe.id, currentRecipe)
      .then(response => {
        console.log(response.data);
        setMessage("The Recipe was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteRecipe = () => {
    RecipeDataService.remove(currentRecipe.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/Recipes");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="row justify-content-center">
      {currentRecipe ? (
        <div className="col-md-8 detail">
          <h4>{currentRecipe.titre}</h4>
          <img src={currentRecipe.photo} class="card-image img-fluid img-cover rounded" />
          <p>{currentRecipe.description}</p>
          <div>
              <label>
                <strong>niveau:</strong>
              </label>{" "}
              {currentRecipe.niveau}
            </div>
            <div>
              <label>
                <strong>personnes:</strong>
              </label>{" "}
              {currentRecipe.personnes}
            </div>
            <div>
              <label>
                <strong>temps Preparation:</strong>
              </label>{" "}
              {currentRecipe.tempsPreparation}
            </div>
            <div>
            <ul className="list-group">
              {currentRecipe.ingredients &&
                currentRecipe.ingredients.map((ingredient, index) => (
                <li className="list-group-item ">
                  {ingredient.join(' ')}
                </li>
              ))}
            </ul>
            </div>
            <div>
              <label>
                <strong>Etapes:</strong>
              </label>{" "}
              <ol>
                {currentRecipe.etapes &&
                  currentRecipe.etapes.map((step, index) => (
                  <li>
                    { step }
                  </li>
                ))}
              </ol>
            </div>
            <Link to={"/recipe/" + currentRecipe.id} className="btn btn-xs btn-primary">
              Edit
            </Link>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Recipe...</p>
        </div>
      )}
    </div>
  );
};

    

export default RecipeDetail;
