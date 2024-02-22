const ToDoModel = require('../model/todo.model');

exports.createTodo = async (req, res, next) => {
    try {
        const createModel = await ToDoModel.create(req.body);
        res.status(201).json(createModel);
    } catch (err) {
        next(err);
    }
};

exports.getTodos = async (req, res, next) => {
    try {
        const allTodos = await ToDoModel.find({});
        res.status(200).json(allTodos);
    } catch (err) {
        next(err);
    }
};

exports.getTodoById = async (req, res, next) => {
    try {
        const todo = await ToDoModel.findById(req.params.todoId);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }    
};

exports.updateTodo = async (req, res, next) => {
    try {
        const todo = await ToDoModel.findByIdAndUpdate(req.params.todoId, req.body, { new: true, useFindAndModify: false });
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteTodo = async (req, res, next) => {
    try {
        const todo = await ToDoModel.findByIdAndDelete(req.params.todoId);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err)
    }
}