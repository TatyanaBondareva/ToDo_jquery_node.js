'use strict'

let express = require('express');
let routes = express.Router();
let Task = require('./Task');


routes.route('/all').get((req, res) => {
    Task.find((err, data) => {
        if (err) { return next(err); }
        else { res.json(data); };
    });
});

routes.route('/delete-checked').post((req, res) => {
    // Task.dropCollection((err, data) => {
    //     if (err) { return err; }
    //     else { res.status(200).json({ msg: data }); };
    // });
    Task.find({checked: true}).remove((err, data) => {
        if (err) { return err; }
        else { res.status(200).json({ msg: data }); };
    });
});

routes.route('/delete-item/:id').post((req, res) => {
    Task.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) { return err; }
        else { res.status(200).json({ msg: data }); }
    })
})

routes.route('/add-item').post((req, res) => {
    Task.create(req.body, (err, data) => {
        if (err) { return err; }
        else { res.status(201).json(data); }
    })
})

routes.route('/update-item-checked/:id').post((req, res) => {
    Task.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
        if (err) { return err; }
        else { res.status(201).json(data); }
    })
})

routes.route('/select-all').post((req, res) => {
    Task.updateMany({checked: req.body.checked}, (err, data) => {
        if (err) { return err; }
        else {
            res.status(201).json(data);
        };
    });
});

module.exports = routes;