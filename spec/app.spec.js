process.env.NODE.ENV = 'test';
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');
const chai = require ('chai');
const {expect} = chai;

describe('/', () => {
    after(() => connection.destroy())
    beforeEach(() => connection.seed.run())
})
