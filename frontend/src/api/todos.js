import { apiClient } from './client';

export const todosApi = {
  getTodos(params = {}) {
    return apiClient.get('/todos', { params });
  },

  getTodoById(id) {
    return apiClient.get(`/todos/${id}`);
  },

  createTodo(title) {
    return apiClient.post('/todos', { title });
  },

  updateTodo(id, data) {
    return apiClient.patch(`/todos/${id}`, data);
  },

  deleteTodo(id) {
    return apiClient.delete(`/todos/${id}`);
  },

  reorderTodos(todoIds) {
    return apiClient.patch('/todos/reorder', { todoIds });
  },
};
