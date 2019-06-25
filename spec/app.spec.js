process.env.NODE.ENV = 'test';
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');
const chai = require ('chai');
const {expect} = chai;

describe.only('/', () => {
    after(() => connection.destroy())
    beforeEach(() => connection.seed.run())

    describe('/api', () => {
        describe('/topics', () => {
            it('GET: status code 200 and returns an array of topic objects', () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    expect(res.body.topics).to.be.an('array');
                    expect(res.body.topics[0]).to.contain.keys('slug', 'description')
                    })
                })
            
        })
    })
})
