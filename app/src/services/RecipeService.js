import http from "../http-common";

const getAll = () => {
  return http.get("/recipes");
};

const get = id => {
  return http.get(`/recipe/${id}`);
};


const create = data => {
  return http.post("/recipes", data);
};

const update = (id, data) => {
  return http.put(`/recipe/${id}`, data);
};

const remove = id => {
  return http.delete(`/recipe/${id}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
};