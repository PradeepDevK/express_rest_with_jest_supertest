const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-data.json');

const endpointUrl = "/todos/";
let firstTodo;
let newTodoId;
const testData = { 
    title: "Make integration test for PUT",
    done: true
};
const nonExistingId = "65d6384fc9c898c2f73a284b";

describe(endpointUrl, () => {

    
    test("GET" + endpointUrl, async () => {
        const response = await request(app)
        .get(endpointUrl)
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    });

    test("GET By Id" + endpointUrl + ":todoId", async () => {
        const response = await request(app)
        .get(endpointUrl + firstTodo._id)
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });

    test("GET todo by Id doesn't exists" + endpointUrl + ":todoId", async () => {
        const response = await request(app)
        .get(endpointUrl + nonExistingId)
        expect(response.statusCode).toBe(404);
    });

    it("POST " + endpointUrl, async () => {
        const response = await request(app)
        .post(endpointUrl)
        .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        newTodoId = response.body._id;
    });

    it("should return error 500 on malformed data with POST " + endpointUrl, async () => {
        const response = await request(app)
        .post(endpointUrl)
        .send({ 'title': 'Missing done property'})
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message: "ToDo validation failed: done: Path `done` is required."
        })
    });

    test("PUT" + endpointUrl + ":todoId", async () => {
        const response = await request(app)
        .put(endpointUrl + newTodoId)
        .send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });

    test("PUT should return 404" + endpointUrl + ":todoId", async () => {
        const response = await request(app)
        .put(endpointUrl + nonExistingId)
        .send(testData);
        expect(response.statusCode).toBe(404);
    });

    test("DELETE" + endpointUrl + ":todoId", async () => {
        const response = await request(app)
        .delete(endpointUrl + newTodoId)
        .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });

    test("DELETE 404" + endpointUrl + ":todoId", async () => {
        const response = await request(app)
        .delete(endpointUrl + nonExistingId)
        .send();
        expect(response.statusCode).toBe(404);
    });
});