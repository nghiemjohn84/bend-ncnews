process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');
const chai = require('chai');
const { expect } = chai;

describe.only('/', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  describe('/', () => {
    it('GET: status code 404 when an invalid route is unavailable', () => {
      return request(app)
        .get('/invalidRoute')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Route Not Found!');
        });
    });
  });

  describe('/api', () => {
    describe('/topics', () => {
      it('GET: status code 200 and returns an array of topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an('array');
            expect(res.body.topics[0]).to.contain.keys('slug', 'description');
          });
      });
      it('GET: status code 404 when an invalid route is passed', () => {
        return request(app)
          .get('/api/topics/invalidRoute')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Route Not Found!');
          });
      });
      it('Invalid Method: status code 405', () => {
        const invalidMethods = ['patch', 'put', 'post', 'delete'];
        const methodPromise = invalidMethods.map(method => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal('Method Not Allowed');
            });
        });
        return Promise.all(methodPromise);
      });
    });
    describe('/users', () => {
      describe('/users/:username', () => {
        it('GET: status code 200 and responds with a single item object containing a specfied username', () => {
          return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then(res => {
              expect(res.body.user.username).to.equal('rogersop');
              expect(res.body.user).to.contain.keys(
                'username',
                'avatar_url',
                'name'
              );
            });
        });
        it('GET: status code 404 when user enters a username that is not found', () => {
          return request(app)
            .get('/api/users/bobby')
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(`Username bobby not found`);
            });
        });
        it('Invalid Method: status code 405', () => {
          const invalidMethods = ['patch', 'put', 'post', 'delete'];
          const methodPromise = invalidMethods.map(method => {
            return request(app)
              [method]('/api/users/:username')
              .expect(405)
              .then(res => {
                expect(res.body.msg).to.equal('Method Not Allowed');
              });
          });
          return Promise.all(methodPromise);
        });
      });
    });
  });
  describe('/articles', () => {
    it('GET: status code 200 and returns an array of article objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles[0]).to.contain.keys(
            'article_id',
            'title',
            'author',
            'body',
            'created_at',
            'votes'
          );
        });
    });
    it('Invalid Method: status code 405', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromise = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromise);
    });
  });
  describe('/articles', () => {
    describe('/:article_id', () => {
      it('GET: status code 200 and returns an object of the single object based on its ID', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(res => {
            expect(res.body.article.article_id).to.equal(1);
            expect(res.body.article).to.contain.keys(
              'article_id',
              'title',
              'topic',
              'author',
              'body',
              'created_at',
              'votes',
              'comment_count'
            );
            expect(res.body.article.comment_count).to.equal('13');
          });
      });
      it('GET: status code 404 when user enters an article ID that is not available', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('article 999 not found');
          });
      });
      it('GET: status code 400 when an invalid id (not a number) is passed for article_id', () => {
        return request(app)
          .get('/api/articles/invalid')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Input');
          });
      });
      it('PATCH: status code 201 and responds with the article with an incremented vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
          .expect(201)
          .then(res => {
            expect(res.body.article.votes).to.equal(110);
            expect(res.body.article).to.contain.keys(
              'article_id',
              'title',
              'topic',
              'author',
              'body',
              'created_at',
              'votes'
            );
          });
      });
      it('PATCH: status code 201 and responds with the article with a decremented vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -10 })
          .expect(201)
          .then(res => {
            expect(res.body.article.votes).to.equal(90);
          });
      });
      it('PATCH: status 400 when an invalid request has been made for the vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'cat' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Input');
          });
      });
      it('PATCH: status 400 when no value has been provided for the vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 0 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Vote Count Value Required');
          });
      });
      it('Invalid Method: status code 405', () => {
        const invalidMethods = ['put', 'post', 'delete'];
        const methodPromise = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles/:article_id')
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal('Method Not Allowed');
            });
        });
        return Promise.all(methodPromise);
      });
    });
    describe.only('/:article_id/comments', () => {
      it('POST: status code 201 and responds with the posted comment based on the article_id', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'rogersop', body: 'Hello, this is a test' })
          .expect(201)
          .then(res => {
            expect(res.body.comment.author).to.equal('rogersop');
            expect(res.body.comment.article_id).to.equal(1);
            expect(res.body.comment.body).to.equal('Hello, this is a test');
          });
      });
      it('POST: status code 400 when invalid article id is used', () => {
        return request(app)
          .post('/api/articles/999/comments')
          .send({ username: 'rogersop', body: 'Hello, this is a test' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Request');
          });
      });
      it('POST: status code 400 when invalid username is used', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'bobby', body: 'Hello, this is a test' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Request');
          });
      });
      it('POST: status code 400 when no comment body has been provided', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'rogersop' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Missing Required Information');
          });
      });
      it('POST: status code 400 when no username has been provided', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ body: 'Hello, this is a test' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Username Required');
          });
      });
      it('GET: status code 200 and responds an array of comments for a given article ID', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comment[0].article_id).to.equal(1)
            expect(res.body.comment.length).to.equal(13)
            expect(res.body.comment[0]).to.contain.keys('comment_id', 'author', 'created_at', 'votes', 'body')
          })
      });
    });
  });
});
