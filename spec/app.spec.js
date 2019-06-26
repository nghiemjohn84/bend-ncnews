process.env.NODE_ENV = 'test';
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
            it('GET: status code 404 when an invalid route is passed', () => {
                return request(app)
                .get('/api/topics/invalid')
                .expect(404)
                .then (res => {
                    expect(res.body.msg).to.equal('Route not found')
                })
            })
        })
        describe('/users', () => {
            describe('/users/:username', () => {
                it('GET: status code 200 and responds with a single item object containing a specfied username', () => {
                    return request(app)
                    .get('/api/users/rogersop')
                    .expect(200)
                    .then(res => {
                        expect(res.body.user.username).to.equal('rogersop')
                        expect(res.body.user).to.contain.keys(
                            'username',
                            'avatar_url',
                            'name')
                    })
                })
                it('GET: status code 404 when user enters a username that is not found', () => {
                    return request(app)
                    .get('/api/users/bobby')
                    .expect(404)
                    .then(res => {
                        expect(res.body.msg).to.equal(`Username bobby not found`)
                    })
                })
            })
        })
    })
    describe('/articles',() => {
        it('GET: status code 200 and returns an array of article objects', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(res => {
                expect(res.body.articles).to.be.an('array');
                expect(res.body.articles[0]).to.contain.keys('article_id', 'title', 'author', 'body', 'created_at', 'votes')
            })
        })
        it('GET: status code 404 when an invalid route is passed', () => {
            return request(app)
            .get('/api/articles/invalid')
            .expect(404)
            .then (res => {
                expect(res.body.msg).to.equal('Route not found')
            })
        })
    })
})
