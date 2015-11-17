"use strict";
const assert = require('assert');
const app = require('.././index.js');
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
        it('should return Pollster', function () {
            request.get('http://localhost:3000', function (error, response) {
                assert(response.body.includes("Pollster"));
            });
        });
    });

    describe('POST /new-poll', function () {

        it('should return a 200 with urls', function () {
            var poll = {title: "Favorite color?",
                response1: "Green",
                response2: "Blue",
                response3:"Red",
                response4:"Yellow",
                endingTime: "4:00",
                endingDate: "12/1/2015",
                userTimezone: 420 };

                request.post('http://localhost:3000/new-poll', { form: poll }, function (error, response) {
                    assert(response.body.includes("Favorite Color?"));
                    assert(response.body.includes("Vistor Url"));
                    assert(response.body.includes("Admin Url"));
                });

            });

        });

    describe('GET /poll/poll-id', function () {

        it('should show poll page with responses', function () {
            var poll = {title: "Favorite color?",
                response1: "Green",
                response2: "Blue",
                response3:"Red",
                response4:"Yellow",
                endingTime: "4:00",
                endingDate: "12/1/2015",
                userTimezone: 420 };

            request.post('http://localhost:3000/new-poll', { form: poll }, function (error, response) {
            });

            request.get('http://localhost:3000/poll/74d010dd46e067d0280cb836cdded117', function (error, response) {
                console.log(response.body);
                assert(response.body.includes("Poll ends on 12/1/2015"));
                assert(response.body.includes("Green"));
                assert(response.body.includes("Blue"));
                assert(response.body.includes("Red"));
                assert(response.body.includes("Yellow"));
            });
        });
    });

    describe('GET /admin-id/poll-id', function () {

        it('should show poll page with responses', function () {
            var poll = {title: "Favorite color?",
                response1: "Green",
                response2: "Blue",
                response3:"Red",
                response4:"Yellow",
                endingTime: "4:00",
                endingDate: "12/1/2015",
                userTimezone: 420 };

            request.post('http://localhost:3000/new-poll', { form: poll }, function (error, response) {

            });

            request.get('http://localhost:3000/d382816a3cbeed082c9e216e7392eed1/74d010dd46e067d0280cb836cdded117', function (error, response) {
                assert(response.body.includes("Poll ends on 12/1/2015"));
                assert(response.body.includes("View Results"));
            });
        });
    });

});
