/**
 * Todo controller: CRUD and list with filter + pagination.
 * All operations are scoped to the authenticated user.
 */
const Todo = require('../models/Todo');
const { NotFoundError } = require('../utils/errors');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * GET /api/todos
 * Query: page, limit, filter (all|active|completed)
 */
exports.getTodos = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT)
    );
    const filterType = (req.query.filter || 'all').toLowerCase();
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    if (filterType === 'active') query.completed = false;
    if (filterType === 'completed') query.completed = true;

    const [todos, total] = await Promise.all([
      Todo.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Todo.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        todos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/todos
 * Body: { title }
 */
exports.createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: { todo } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/todos/:id
 */
exports.getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();
    if (!todo) throw new NotFoundError('Todo not found');
    res.json({ success: true, data: { todo } });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/todos/:id
 * Body: { title?, completed? }
 */
exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!todo) throw new NotFoundError('Todo not found');
    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;
    await todo.save();
    res.json({ success: true, data: { todo } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/todos/:id
 */
exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!todo) throw new NotFoundError('Todo not found');
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
};
