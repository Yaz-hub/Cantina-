const {isString, isNumber} = require('util')
const _clone = require('lodash/clone')
const _isEmpty = require('lodash/isEmpty')
const RECIPES_DATA = require('./data/recipes.json')

module.exports = class Recipes {
    constructor() {
        this.recipes = []
        Object.assign(this.recipes, RECIPES_DATA)

        this.lastInsertId = this.recipes.length;
    }

    fetchAll() {
        return this.recipes
    }

    fetchOne(id) {
        if (!id) throw new Error(`ID de recette manquant`)

        id = Number(id)
        if (!isNumber(id)) throw new Error(`L'ID de recette doit être un nombre entier`)

        const recipe = this.recipes.find(r => r.id === id)

        if (!recipe) return null

        return recipe
    }

    create(recipeObj) {
        if (!recipeObj) throw new Error(`Aucune donnée envoyée`)

        // Validation des données
        const fields = [
            'titre',
            'description',
            'niveau',
            'personnes',
            'tempsPreparation',
            'ingredients',
            'etapes'
        ]

        // Existance des données
        fields.forEach(field => {
            if (!recipeObj.hasOwnProperty(field) || !recipeObj[field]) {
                throw new Error(`Champs "${field}" manquant`)
            }
        })

        // Structure des données
        recipeObj.titre            = String(recipeObj.titre)
        recipeObj.description      = String(recipeObj.description)
        recipeObj.niveau           = String(recipeObj.niveau)
        // recipeObj.personnes        = String(recipeObj.personnes)
        // recipeObj.tempsPreparation = String(recipeObj.tempsPreparation)

        // Niveaux
        const niveaux = ['padawan', 'jedi', 'maitre']
        if (!niveaux.includes(recipeObj.niveau)) {
            throw new Error(`Le champs "niveau" doit être l'un des suivants : ${niveaux.join(',')}`)
        }
        
        // Personnes
        if (!isNumber(recipeObj.personnes)) {
            throw new Error(`Le champs "personnes" doit être un nombre entier`)
        }

        // Temps de préparation
        if (!isNumber(recipeObj.tempsPreparation)) {
            throw new Error(`Le champs "tempsPreparation" doit être un nombre entier`)
        }

        // Ingrédients
        if (!Array.isArray(recipeObj.ingredients)) {
            throw new Error(`Champs "ingredients" invalide. Cela doit être un tableau`)
        }
        else if (!recipeObj.ingredients.every(arr => Array.isArray(arr) && arr.length === 2 && arr.every(val => isString(val)))) {
            throw new Error(`Tableau "ingredients" invalide. Cela doit être un tableau de sous-tableaux ayant 2 valeurs :\nPar exemple :  [ ["8","feuilles de brick"] , ["1","oeuf"] , ... ]`)
        }

        // Etapes
        // throw new Error(`${recipeObj}`);
        if (!Array.isArray(recipeObj.etapes) || recipeObj.etapes.every(etape => !isString(etape))) {
            throw new Error(`Champs "etapes" invalide. Cela doit être un tableau contenant des chaînes de caractères`)
        }

        // Pas d'erreurs, on sauvegarde
        const newRecipe = {
            "id"               : ++this.lastInsertId,
            "titre"            : recipeObj.titre,
            "description"      : recipeObj.description,
            "niveau"           : recipeObj.niveau,
            "personnes"        : recipeObj.personnes,
            "tempsPreparation" : recipeObj.tempsPreparation,
            "ingredients"      : recipeObj.ingredients,
            "etapes"           : recipeObj.etapes
        }

        // Photo (facultatif)
        if (recipeObj.photo && "string" === typeof recipeObj.photo) {
            newRecipe["photo"] = recipeObj.photo;
        }

        this.recipes.push(newRecipe)

        // Retourne l'objet créé
        return newRecipe
    }

    update(recipeObj, fields) {
        if (!recipeObj || !fields || _isEmpty(fields)) throw new Error(`Aucune donnée envoyée`)

        // Titre
        if (fields.titre)
            recipeObj.titre = String(fields.titre)
        
        // Description
        if (fields.description)
            recipeObj.description = String(fields.description)

        // Niveaux
        if (fields.niveau) {
            const niveaux = ['padawan', 'jedi', 'maitre']

            if (!niveaux.includes(fields.niveau))
                throw new Error(`Le champs "niveau" doit être l'un des suivants : ${niveaux.join(',')}`)
            
            recipeObj.niveau = String(fields.niveau)
        }
        
        // Personnes
        if (fields.personnes) {
            if (!isNumber(fields.personnes))
                throw new Error(`Le champs "personnes" doit être un nombre entier`)

            recipeObj.personnes = fields.personnes
        }

        // Temps de préparation
        if (fields.tempsPreparation) {
            if (!isNumber(fields.tempsPreparation))
                throw new Error(`Le champs "tempsPreparation" doit être un nombre entier`)

            recipeObj.tempsPreparation = fields.tempsPreparation
        }

        // Ingrédients
        if (fields.ingredients) {
            if (!Array.isArray(fields.ingredients)) {
                throw new Error(`Champs "ingredients" invalide. Cela doit être un tableau`)
            }
            else if (!fields.ingredients.every(arr => Array.isArray(arr) && arr.length === 2 && arr.every(val => isString(val)))) {
                throw new Error(`Tableau "ingredients" invalide. Cela doit être un tableau de sous-tableaux ayant 2 valeurs :\nPar exemple :  [ ["8","feuilles de brick"] , ["1","oeuf"] , ... ]`)
            }

            recipeObj.ingredients = _clone(fields.ingredients)
        }

        // Etapes
        if (fields.etapes) {
            if (!Array.isArray(fields.etapes) || fields.etapes.every(etape => !isString(etape))) {
                throw new Error(`Champs "etapes" invalide. Cela doit être un tableau contenant des chaînes de caractères`)
            }

            recipeObj.etapes = _clone(fields.etapes)
        }

        // Photo (facultatif)
        if (fields.photo && "string" === typeof fields.photo) {
            recipeObj["photo"] = fields.photo;
        }

        // Pas d'erreurs, on retourne l'objet créé
        return recipeObj
    }

    delete(recipeObj) {
        const recipeIndex = this.recipes.findIndex(recipe => recipe.id === recipeObj.id)

        if (!recipeIndex) throw new Error(`Rien à supprimer`)

        this.recipes.splice(recipeIndex, 1)

        return recipeObj
    }
}