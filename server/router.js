const express = require('express')
const router = new express.Router()

const Recipes = require('./Recipes')
const recipesModel = new Recipes()

/**
 * Routes de la ressource
 */

router.get('/recipes', getRecipes)
router.get('/recipe/:id', getRecipe)
router.post('/recipes', createRecipe)
router.put('/recipe/:id', updateRecipe)
router.delete('/recipe/:id', deleteRecipe)

/**
 * GET /recipes
 * Renvoie la liste de toutes les recettes
 */

function getRecipes(req, res) {
    return res.status(200).json(
        recipesModel.fetchAll()
    )
}

/**
 * GET /recipe/:id
 * Renvoie la recette portant l'identifiant ":id"
 */

function getRecipe(req, res) {
    try {
        const recipe = recipesModel.fetchOne(req.params.id)

        if (recipe === null)
            return res.status(404).json({errorMessage: `Aucune recette trouvée`})

        return res.status(200).json(recipe)
    }
    catch (error) {
        return res.status(400).json({errorMessage: error.message})
    }
}

/**
 * POST /recipes
 * Ajoute une nouvelle recette à la liste du serveur
 */

function createRecipe(req, res) {
    try {
        const newRecipe = recipesModel.create(req.body)
        return res.status(201).send({message: `Recette créée avec succès !`, recette: newRecipe})
    } catch (error) {
        return res.status(400).send({errorMessage: error.message})
    }
}

/**
 * PUT /recipe/:id
 * Modifie la recette portant l'identifiant ":id"
 */

function updateRecipe(req, res) {
    try {
        const recipe = recipesModel.fetchOne(req.params.id)

        if (recipe === null)
            return res.status(404).json({errorMessage: `Aucune recette trouvée`})

        try {
            const updatedRecipe = recipesModel.update(recipe, req.body)
            return res.status(200).json({message: `Recette mise à jour avec succès !`, recette: updatedRecipe})
        }
        catch (error) {
            return res.status(400).send({errorMessage: error.message})
        }
    }
    catch (error) {
        return res.status(400).json({errorMessage: error.message})
    }
}

/**
 * DELETE /recipe/:id
 * Supprime la recette portant l'identifiant ":id"
 */

function deleteRecipe(req, res) {
    try {
        const recipe = recipesModel.fetchOne(req.params.id)

        if (recipe === null)
            return res.status(404).json({errorMessage: `Aucune recette trouvée`})

        try {
            recipesModel.delete(recipe)
            return res.status(200).json({message: `Recette supprimée avec succès !`, recette: recipe})
        }
        catch (error) {
            return res.status(400).send({errorMessage: error.message})
        }
    }
    catch (error) {
        return res.status(400).json({errorMessage: error.message})
    }
}

// Export du modèle
module.exports = router