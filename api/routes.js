const path = require('path');

const axios = require('axios');

const db = require('./models');

module.exports = function (app) {

    // Query google books API
    app.get('/api/search/:search', (req, res) => {
        const query = req.params.search.replace(/\s+/g, '+');
        axios.get('https://www.googleapis.com/books/v1/volumes?q=' + query + '&key=' + process.env.googleAPI)
            .then(response => {
                return res.json({ items: response.data.items });
            })
            .catch(err => {
                console.log(err);
            });
    });

    // Return all saved books
    app.get('/api/books', (req, res) => {
        db.Book.find({})
            .then(books => {
                console.log(books);
                res.json(books);
            })
            .catch(err => {
                console.log(err);
            })
    });

    // Save new book to db
    app.post('/api/save/', (req, res) => {
        db.Book.create(req.body)
            .then(data => {
                console.log('saved');
                res.json(data);
            })
            .catch(err => {
                console.log(err);
            });
    });

    // Delete book from db 
    app.delete('/api/delete/:id', (req, res) => {
        db.Book.remove(req.params.id)
            .catch(err => {
                console.log(err);
            });
    });

    // Send all other routes to React
    app.get("*", (req, res) => {
        // res.sendFile(path.join(__dirname, "./client/build/index.html"));
        console.log('Send route to React');
    });

}