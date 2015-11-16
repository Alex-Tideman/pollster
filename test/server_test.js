"use strict";
const chai   = require('chai');
const assert = chai.assert;
const app = require('../index.js');
const request = require('request');

describe('Server', function () {


it('should exist', function () {
        assert(app);
    });

    describe('GET /', function () {
        it('should return a 200', function () {
            request.get('http://localhost:3000', function (error, response) {
                assert.equal(response.statusCode, 200);
            });
        });
    });

    describe('POST /new-poll', function () {
        beforeEach(function() {
            app.locals.polls = {};
        });

        it('should return a 200 with urls', function () {
            var poll =          {title: "Favorite color?",
                response1: "Green",
                response2: "Blue",
                response3:"Red",
                response4:"Yellow",
                endingTime: "4:00pm"};

            this.request.post('/new-poll', { form: poll }, function (error, response) {

                var pollCount = Object.keys(app.locals.polls).length;
                assert.equal(pollCount, 1, `Expected 1 poll, found ${pollCount}`);
            });
        });
    });
});
