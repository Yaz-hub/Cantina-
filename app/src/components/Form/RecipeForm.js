import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Formik, Form, FieldArray, useField, useFormikContext} from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import "./styles.css";
import "./styles-custom.css";
import { Field } from "formik";
import { alertService } from "../../services";
import RecipeDataService from "../../services/RecipeService";

// Styled components ....
const StyledSelect = styled.select`
  color: var(--blue);
`;

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin-top: 0.25rem;
  &:before {
    content: "❌ ";
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`;

const StyledLabel = styled.label`
  margin-top: 1rem;
`;

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
      <StyledSelect {...field} {...props} />
      {meta.touched && meta.error ? (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      ) : null}
    </>
  );
};

const MyTextArea = ({label, ...props}) => {
  const [field, meta] = useField(props);
  return (
      <>
          <label htmlFor={props.id || props.name}>{label}</label>
          <textarea className="text-area" {...field} {...props} />
          {meta.touched && meta.error ? (
              <div className="error">{meta.error}</div>
          ) : null}
      </>
  );
};

// And now we can use these
const RecipeForm = props => {
  const { id } = props.match.params;
  const isAddMode = !id;

  const [submitted, setSubmitting] = useState(false);

  function onChangeIngredients(e, field, values, setValues) {
    // update dynamic form depnding on number of ingredients
    const ingredients = [...values.ingredients];
    const numberOfIngredients = e.target.value || 0;
    const previousNumber = parseInt(field.value || '0');
    if (previousNumber < numberOfIngredients) {
        for (let i = previousNumber; i < numberOfIngredients; i++) {
          ingredients.push({ name: '', qty: '' });
          // ingredients.push(['','']);
        }
    } else {
        for (let i = previousNumber; i >= numberOfIngredients; i--) {
          ingredients.splice(i, 1);
        }
    }
    setValues({ ...values, ingredients });
  
    // call formik onChange method
    field.onChange(e);
  }
  
  function onChangeSteps(e, field, values, setValues) {
    // update dynamic form depnding on number of steps
    const etapes = [...values.etapes];
    const numberOfSteps = e.target.value || 0;
    const previousNumber = parseInt(field.value || '0');
    if (previousNumber < numberOfSteps) {
        for (let i = previousNumber; i < numberOfSteps; i++) {
          // etapes.push('');
          etapes.push({description: ''});
        }
    } else {
        for (let i = previousNumber; i >= numberOfSteps; i--) {
          etapes.splice(i, 1);
        }
    }
    setValues({ ...values, etapes });
  
    // call formik onChange method
    field.onChange(e);
  }
  
  function onSubmit(fields, { setStatus, setSubmitting }) {
    if (isAddMode) {
      // handle ingredient format
      const ingredients = []
      fields.ingredients.map(ingredient => {
        ingredients.push([ingredient.qty.toString(), ingredient.name]);
      });
      // reset ingredients to be array of arrays and contain only strings
      fields.ingredients = ingredients;

      // handle steps format
      const steps = []
      fields.etapes.map(step => {
        steps.push(step.description);
      });
      // reset etapes to be array of strings
      fields.etapes = steps;
      createRecipe(fields, setSubmitting);
    } else {
      updateRecipe(id, fields, setSubmitting);
    }
  }

  function createRecipe(fields, setSubmitting) {
    RecipeDataService.create(fields)
      .then(e => {
        alertService.success('Recipe added', { keepAfterRouteChange: true });
      })
      .catch(e => {
        alertService.error(e);
        setSubmitting(false);
        console.log(e);
      });
  }

  function updateRecipe(id, fields, setSubmitting) {
    RecipeDataService.update(id, fields)
      .then(e => {
        alertService.success('Recipe modified', { keepAfterRouteChange: true });
      })
      .catch(e => {
        setSubmitting(false);
        alertService.error(e);
      });
  }

  return (
    <>
      <h1>Add a recipe!</h1>
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
        </div>
      ) : (
      <Formik
        initialValues={{
          titre: "",
          description: "",
          niveau: "padawan",
          tempsPreparation: 0, 
          ingredients: [],
          etapes: [],
          personnes:"",
          photo: "",
          numberOfIngredients: 0,
          numberOfSteps: 0
        }}
        // validationSchema={Yup.object({    
        //   titre: Yup.string().required("Required"),
        //   descrition: Yup.string().required("Required"),
        //   tempsPreparation: Yup.number().required("Required"),
        //   personnes: Yup.number().required("Required"),
        //   numberOfIngredients: Yup.number().required('Number of ingredients is required'),
          // ingredients: Yup.array().of(
          //     Yup.object().shape({
          //         name: Yup.string().required('Name is required'),
          //         qty: Yup.number().required('Quantity is required')
          //     })
          // ),
          // etapes: Yup.array().of(
          //   Yup.object().shape({
          //       description: Yup.string().required('Name is required')
          //   })
          // ),
        // })}
        onSubmit={onSubmit}
      >
        {function ShowForm({ values, isSubmitting, setFieldValue, setValues })  {
          const [recipe, setRecipe] = useState({});
          useEffect(() => {
              if (!isAddMode) {
                  // get user and set form fields
                  RecipeDataService.get(id)
                    .then(response => {
                      const fields = ['titre','description','niveau','tempsPreparation','ingredients','etapes','personnes','photo'] ;
                      fields.forEach(field => setFieldValue(field, response.data[field], false));
                      setRecipe(response.data);
                    });
              }
          }, []);

          return (
            <Form>
            <MyTextInput
              label="Titre"
              name="titre"
              type="text"
              required="required"
            />
            <MyTextArea
              label="Description"
              name="description"
              type="text"
              required="required"
            />
            <MyTextInput
              label="Photo"
              name="photo"
              type="text"
            />
            <MyTextInput
              label="Personnes"
              name="personnes"
              type="number"
              required="required"
            />
            <MyTextInput
              label="Temps de preparation"
              name="tempsPreparation"
              type="number"
            />
            <Field name="numberOfIngredients" required="required" min="2">
            {({ field }) => (
                <>
                <label forhtml="numberOfIngredients">Number Of Ingredients</label>
                <input {...field} 
                className="text-input" 
                type="text"
                defaultValue={values.ingredients.length}
                onChange={e => onChangeIngredients(e, field, values, setValues)}
                required="required"
                min="2"
                >
                </input>
                </>
            )}
            </Field>
            <FieldArray name="ingredients">
            {() => (values.ingredients.map((ingredient, i) => {
                return (
                    <div key={i} className="list-group list-group-flush">
                        <div className="list-group-item">
                            <h5 className="card-title">Ingredient {i + 1}</h5>
                            <div className="form-row">
                            <MyTextInput
                              label="name" 
                              name={`ingredients.${i}.name`}
                              type="text"
                              defaultValue={ingredient[1]}
                            />
                            <MyTextInput
                              label="QTY" 
                              name={`ingredients.${i}.qty`}
                              type="text"
                              defaultValue={ingredient[0]}
                            />
                            </div>
                        </div>
                    </div>
                );
            }))}
            </FieldArray>
            <Field name="numberOfSteps">
            {({ field }) => (
                <>
                <label forhtml="numberOfSteps">Number Of Steps</label>
                <input {...field} 
                className="text-input" 
                type="text"
                defaultValue={values.etapes.length}
                onChange={e => onChangeSteps(e, field, values, setValues)}>
                </input>
                </>
            )}
            </Field>
            <FieldArray name="steps">
            {() => (values.etapes.map((etape, i) => {
                return (
                    <div key={i} className="list-group list-group-flush">
                        <div className="list-group-item">
                            <h5 className="card-title">Etape {i + 1}</h5>
                            <div className="form-row">
                            <MyTextArea
                              label="description" 
                              name={`etapes.${i}.description`}
                              defaultValue={etape}
                            />
                            </div>
                        </div>
                    </div>
                );
            }))}
            </FieldArray>
            <MySelect label="Niveau" name="niveau" defaultValue={values.niveau}>
              <option value="padawan">padawan</option>
              <option value="maitre">maitre</option>
              <option value="jedi">jedi</option>
            </MySelect>
            <div className="row">
              <div className="col-2">
                <button type="submit btn mt-2" disabled={isSubmitting}>Submit</button>
              </div>
            </div>
          </Form>
          );
        }}
      </Formik>
      )}
    </>
  );
};

export default RecipeForm;
