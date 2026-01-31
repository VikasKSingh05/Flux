const express = require('express');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');
const {
  validate,
  createTodoValidations,
  updateTodoValidations,
  paginationValidations,
} = require('../middleware/validateRequest');

const router = express.Router();

router.use(auth);

router
  .route('/')
  .get(validate(paginationValidations), todoController.getTodos)
  .post(validate(createTodoValidations), todoController.createTodo);

router
  .route('/:id')
  .get(todoController.getTodoById)
  .patch(validate(updateTodoValidations), todoController.updateTodo)
  .delete(todoController.deleteTodo);

module.exports = router;
