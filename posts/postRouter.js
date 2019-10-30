const express = require("express");

const db = require("../data/dbConfig.js");
const db = require("./postDb.js");

const router = express.Router();

router.get('/', (req, res) => {
    const id = req.params.id;
        db.getById(id)
            .then(post => {
                res.status(200).json(post);
            })
            .catch(err => {
                res.status(500).json({ error: "Cannot find data" });
            });
});

router.get('/:id', validatePostId, (req, res) => {
    const id = req.params.id;
    db.getById(id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Cannot find Id" });
        });
});

router.delete('/:id', validatePostId, (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Could not delete" });
        });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    db.update(id, changes)
        .then(updated => {
            res.status(200).json(updated);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not modify Id" });
        });
});

// custom middleware

function validatePostId(req, res, next) {
    let posts = req.params.id;
    db.getById(posts)
        .then(post => {
            if (post) {
                next();
            } else {
                res.status(400).json({ message: "Could not find Id" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Please try again" })
        });
};

module.exports = router;