import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL}/v1/produtos`;

const listar = (params) => axios.get(API, { params });

const criar = (dados) => axios.post(API, dados);

const atualizar = (id, dados) => axios.put(`${API}/${id}`, dados);

const excluir = (id) => axios.delete(`${API}/${id}`);

const buscarPorId = (id) => axios.get(`${API}/${id}`);

export default {
  listar,
  criar,
  atualizar,
  excluir,
  buscarPorId
};