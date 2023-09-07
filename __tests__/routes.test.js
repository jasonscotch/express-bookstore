process.env.NODE_ENV = "test"

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");



describe("Bookstore Routes Test", () => {

    beforeEach(async () => {
        await db.query(`DELETE FROM books`);

        let b1 = await Book.create({
            isbn: "09283479",
            amazon_url: "http://a.co/eklejl",
            author: "Brandon Sanderson",
            language: "english",
            pages: 567,
            publisher: "Princeton University Press",
            title: "Mistborn",
            year: 2014
        });
    });

    /* GET /books/  */

    describe("GET /books/", () => {
        test("can get all books", async () =>{
            let response = await request(app)
                .get("/books/");
        
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            "books": [
                {
                    "isbn": "09283479",
                    "amazon_url": "http://a.co/eklejl",
                    "author": "Brandon Sanderson",
                    "language": "english",
                    "pages": 567,
                    "publisher": "Princeton University Press",
                    "title": "Mistborn",
                    "year": 2014
                }
            ]
            });
        });
    });

    /*GET /books/[isbn] */

    describe("GET /books/:id", () => {
        test("can get one book", async () =>{
            let response = await request(app)
                .get(`/books/09283479`);
        
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            "book": {
                "isbn": "09283479",
                "amazon_url": "http://a.co/eklejl",
                "author": "Brandon Sanderson",
                "language": "english",
                "pages": 567,
                "publisher": "Princeton University Press",
                "title": "Mistborn",
                "year": 2014
                }
            });
        });
        test("Responds with 404 if can't find book", async () => {
            const response = await request(app)
                .get(`/books/100`)
            expect(response.statusCode).toBe(404);
          });
    });

    /*POST /books/ */

    describe('POST /books/', () => {
        test("can add a book", async () => {
            let response = await request(app)
                .post("/books/")
                .send({
                    isbn: "5555555555",
                    amazon_url: "http://a.co/safewf",
                    author: "Brandon Sanderson",
                    language: "english",
                    pages: 987,
                    publisher: "Princeton University Press",
                    title: "The Way of Kings",
                    year: 2014
                });
            expect(response.statusCode).toBe(201);

            expect(response.body).toEqual({
                "book": {
                    "isbn": "5555555555",
                    "amazon_url": "http://a.co/safewf",
                    "author": "Brandon Sanderson",
                    "language": "english",
                    "pages": 987,
                    "publisher": "Princeton University Press",
                    "title": "The Way of Kings",
                    "year": 2014
                    }
            });
        });
        test("Prevents improper formatting", async () => {
            const response = await request(app)
                .put(`/books/`)
                .send({
                    isbn: "5555555555",
                    amazon_url: "http://a.co/safewf",
                    author: "Brandon Sanderson",
                    language: "english",
                    pages: 987,
                    publisher: "Princeton University Press",
                    title: "The Way of Kings",
                    year: 2014,
                    extra_field: "not allowed"
                });
            expect(response.statusCode).toBe(404);
          });
    });
   
    /*PUT /books/[isbn] */

    describe('PUT /books/:id', () => {
        test("can edit a book", async () => {
            let response = await request(app)
                .put("/books/09283479")
                .send({
                    isbn: "09283479",
                    amazon_url: "http://a.co/safewf",
                    author: "Brandon Sanderson",
                    language: "english",
                    pages: 987,
                    publisher: "Princeton University Press",
                    title: "The Way of Kings",
                    year: 2014
                });
            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual({
                "book": {
                    "isbn": "09283479",
                    "amazon_url": "http://a.co/safewf",
                    "author": "Brandon Sanderson",
                    "language": "english",
                    "pages": 987,
                    "publisher": "Princeton University Press",
                    "title": "The Way of Kings",
                    "year": 2014
                    }
            });
        });
        test("Responds with 404 if can't find book", async () => {
            const response = await request(app)
                .get(`/books/100`)
            expect(response.statusCode).toBe(404);
          });
    });

    /*DELETE /books/[isbn] */

    describe("DELETE /books/:isbn", () => {
        test("Deletes a single book", async () => {
            const response = await request(app)
                .delete(`/books/09283479`);
            expect(response.statusCode).toBe(200);
            
            expect(response.body).toEqual({ message: "Book deleted" });
        });
        test("Responds with 404 if can't find book", async () => {
            const response = await request(app)
                .get(`/books/100`)
            expect(response.statusCode).toBe(404);
          });
    });


});

afterEach(async () => {
    await db.query("DELETE FROM books");
  });

afterAll(async () => {
    await db.end();
  });