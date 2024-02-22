const TodoController = require('../../controllers/todo.controller');
const ToDoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-data.json');
const allTodos = require('../mock-data/all-todos.json');
const todoById = require('../mock-data/todo-byid.json');

/**
 * Option 1 For mocking the method
 */
// ToDoModel.create = jest.fn();
// ToDoModel.find = jest.fn();
// ToDoModel.findById = jest.fn();
// ToDoModel.findByIdAndUpdate = jest.fn();
// ToDoModel.findByIdAndDelete = jest.fn();

/**
 * Option 2 For mocking the entire method from model
 */
jest.mock('../../model/todo.model');

let req, res, next;
const todoId = '65d63780d436bf12e1e465b9';
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("TodoController.deleteTodo", () => {
    it("should have a deleteTodo", () => {
        expect(typeof TodoController.deleteTodo).toBe("function");
    });

    it("should update with TodoModel.findByIdAndDelete", async () => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next);
        expect(ToDoModel.findByIdAndDelete).toBeCalledWith(todoId);
    });

    it("should return 200 ok and deleted document", async () => {
        ToDoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should handle errors in deleteTodo", async () => {
        const errorMessage = { message: "Error deleting todoModel" };
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await TodoController.deleteTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it("should return 404 when item doesn't exists", async () => {
        ToDoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("TodoController.updateTodo", () => {
    it("should have a updateTodo", () => {
        expect(typeof TodoController.updateTodo).toBe("function");
    });

    it("should update with TodoModel.findByIdAndUpdate", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next);
        expect(ToDoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, { new: true, useFindAndModify: false });
    });

    it("should return a response with json data and http code 200", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        ToDoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should handle errors in updateTodo", async () => {
        const errorMessage = { message: "Error updating todoModel" };
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await TodoController.updateTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it("should return 404 when item doesn't exists", async () => {
        ToDoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("TodoController.getTodoById", () => {
    it("should have a getTodoById", () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    });

    it("should call ToDoModel.findById({}) with route parameters", async () => {
        req.params.todoId = todoId;
        await TodoController.getTodoById(req, res, next);
        expect(ToDoModel.findById).toHaveBeenCalledWith(todoId);
    });

    it("should return json body and response code 200", async () => {
        ToDoModel.findById.mockReturnValue(todoById);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(todoById);
    });

    it("should handle errors in getTodos", async () => {
        const errorMessage = { message: "Error finding todoModel" };
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.findById.mockReturnValue(rejectedPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it("should return 404 when item doesn't exists", async () => {
        ToDoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe("TodoController.getTodos", () => {
    it("should have a getTodos function", () => {
        expect(typeof TodoController.getTodos).toBe("function");
    });

    it("should call ToDoModel.find({})",async () => {
        await TodoController.getTodos(req, res, next);
        expect(ToDoModel.find).toHaveBeenCalledWith({});        
    });

    it("should return response with status 200 and all todos", async () => {
        ToDoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });

    it("should handle errors in getTodos", async () => {
        const errorMessage = { message: "Error finding" };
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe("TodoController.createToDo", () => {

    beforeEach(() => {
        req.body = newTodo;
    })

    it("should have a createToDo function", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });

    it("it should call ToDoModel.create", () => {
        TodoController.createTodo(req, res, next);
        expect(ToDoModel.create).toBeCalledWith(newTodo);
    });

    it("should return 201 response code", async () => {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return json body in response", async () => {
        ToDoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it("should handle error", async () => {
        const errorMessage = { message: "Done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        ToDoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});