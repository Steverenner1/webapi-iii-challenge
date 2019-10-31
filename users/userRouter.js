const express = require("express");

const router = express.Router();

const db = require("./userDb.js");
const Posts = require("../posts/postDb.js");

router.use(express.json());

router.post('/', validateUser, (req, res) => {
    const newUser = req.body;
    db.insert(newUser)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "User could not be added" });
        });
});

router.post('/:id/posts', validateUserId, (req, res) => {
    const rePost = req.body;
    rePost.user_id = req.params.id;

    if (rePost) {
        Posts.insert(rePost)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "Could not find post" })
            });
    }
});

router.get('/', validateUser, (req, res) => {
    db.get()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Could not find user" });
        });
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    db.getById(id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Can't find the selected ID" })
        });

});

router.get('/:id/posts', validatePost, (req, res) => {
    const id = req.params.id;
    db.getUserPosts(id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ error: "Cannot retrieve post" });
        });

});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(200).json({ message: "Deleted" });
            } else {
                res.status(404).json({ error: "Could not delete" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error" });
        });
});

router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    db.update(id, changes)
        .then(updated => {
            res.status(200).json(updated);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not update" });
        });
});

//custom middleware

function validateUserId(req, res, next) {
    let users = req.params.id;
    db.getById(users)
        .then(user => {
            if (user) {
                next();
                req.user = user
            } else {
                res.status(400).json({ message: "Could not find user" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Invalid user" });
        });
};

function validateUser(req, res, next) {
    const name = req.body.name;
    if (!req.body) {
        res.status(400).json({ error: "Cannot find name" });
    } else if(!name) {
        res.status(400).json({ error: "Missing name" })
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    const {text} = req.body
    if (req.body){
        text
        ? next()
        : res.status(400).json({message: 'missing required text field'})
    } else {
        res.status(400).json({message: 'missing post data'})
    }

};

// function validatePost(req, res, next) {
    
//     const { text } = req.body;
//     if (req.body) {
//         text
//         res.status(400).json({ error: "Post does not meet qualifications" });
//     } else {
//         next();
//     }
// };

module.exports = router;
