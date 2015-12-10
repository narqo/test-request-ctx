"use strict";

var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');
var vow = require('vow');
var jsonStringify = require('json-stringify-safe');

var resource = require('../lib/resource');
var Context = require('../lib/context').Context;

var app = connect();

const org = 'nodules';
const repo = 'asker';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    const ctx = req.ctx = new Context();

    ctx.start();

    res.once('finish', done);
    res.once('error', cleanup);
    res.once('close', cleanup);

    function done() {
        ctx.stop();
        console.error(jsonStringify(req.ctx, null, 2));
    }

    function cleanup() {
        res.removeEventListener('finish', done);
        res.removeEventListener('error', cleanup);
        res.removeEventListener('close', cleanup);
    }

    next();
});

app.use(function(req, res, next) {
    resource(req.ctx, 'github/repos', { org }).then(() => next());
});

app.use(function(req, res, next) {
    const ctx = req.ctx;

    resource(ctx, 'github/repo', { org, repo })
        .then(data => vow.all(
            [
                resource(ctx, 'github/issues', { org, repo }),
                resource(ctx, 'github/pulls', { org, repo }),
            ]
        ))
        .then(data => {
            res.end('ok!', next);
        })
        .fail(next);
});

module.exports = function(port) {
    http.createServer(app).listen(port);
};
