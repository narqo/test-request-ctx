"use strict"

var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');
var vow = require('vow');
var jsonStringify = require('json-stringify-safe');

var resource = require('../lib/resource');
var Context = require('../lib/context').Context;

var app = connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    const ctx = req.ctx = new Context();
    ctx.start();

    // https://api.github.com/users/nodules/repos
    // https://api.github.com/repos/nodules/asker

    const org = 'nodules';
    const repo = 'asker';

    resource(ctx, 'github', { path: `/users/${org}/repos` })
        .then(data => resource(ctx, 'github', { path: `/repos/${org}/${repo}` }))
        .then(data => vow.all(
            [
                resource(ctx, 'github', { path: `/repos/${org}/${repo}/issues` }),
                resource(ctx, 'github', { path: `/repos/${org}/${repo}/pulls` }),
            ]
        ))
        .then(data => {
            res.end('ok!', next);
        })
        .fail(next);
});

app.use(function(req, res) {
    req.ctx.stop();
    console.error(jsonStringify(req.ctx, null, 2));
})

module.exports = function(port) {
    http.createServer(app).listen(port);
};
