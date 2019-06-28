process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');
const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);

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
            'votes',
            'comment_count'
          );
        });
    });
    it('GET: status code 200 and returns an array of article objects sorted by date in descending order by default', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy('created_at');
        });
    });
    it('GET: status code 200 and returns an array of article objects sorted by a specific column name in descending order as default', () => {
      return request(app)
        .get('/api/articles/?sort_by=title')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy('title');
        });
    });
    it('GET: status code 200 and returns an array of article objects sorted by a specific column name in ascending order as per query', () => {
      return request(app)
        .get('/api/articles/?sort_by=title&order=asc')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.sortedBy('title');
        });
    });
    it('GET: status code 200 and responds with an array of article objects sorted by a specific column name in ascending order as per query', () => {
      return request(app)
        .get('/api/articles/?sort_by=comment_count&order=asc')
        .expect(200)
        .then(res => {
          res.body.articles.forEach(comment => {
            comment.comment_count = Number(comment.comment_count);
          });
          expect(res.body.articles).to.be.sortedBy('comment_count');
        });
    });
    it('GET: status code 200 and responds with an array of article objects sorted by a specific column name in descending order as default', () => {
      return request(app)
        .get('/api/articles/?sort_by=comment_count')
        .expect(200)
        .then(res => {
          res.body.articles.forEach(comment => {
            comment.comment_count = Number(comment.comment_count);
          });
          expect(res.body.articles).to.be.descendingBy('comment_count');
        });
    });
    it('GET: status code 200 and responds with an array of articles by a specific author', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(res => {
          for (let i = 0; i < res.body.articles.length; i++) {
            expect(res.body.articles[i].author).to.equal('butter_bridge');
          }
          expect(res.body.articles).to.have.lengthOf(3);
        });
    });
    it('GET: status code 200 and responds with an array of articles for a sepcific topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.have.lengthOf(11);
          for (let i = 0; i < res.body.articles.length; i++) {
            expect(res.body.articles[i].topic).to.equal('mitch');
          }
        });
    });
    it('GET: status code 200 and responds with an array of articles for a sepcific topic and from a specific author', () => {
      return request(app)
        .get('/api/articles?topic=mitch&author=butter_bridge')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.have.lengthOf(3);
          for (let i = 0; i < res.body.articles.length; i++) {
            expect(res.body.articles[i].topic).to.equal('mitch');
            expect(res.body.articles[i].author).to.equal('butter_bridge');
          }
        });
    });
    it('GET: status code 400 and responds with an error when sorting by a column that does not exist', () => {
      return request(app)
        .get('/api/articles?sort_by=invalidColumn')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid Query');
        });
    });
    it('GET: status code 404 and responds with an error provided with a non existent topic', () => {
      return request(app)
        .get('/api/articles?topic=imNotHere')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Topic imNotHere Not Found');
        });
    });
    it('GET: status code 404 and responds with an error provided with a non existent author', () => {
      return request(app)
        .get('/api/articles?author=imNotHere')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Author imNotHere Not Found');
        });
    });
    it('GET: status code 400 and when attempting to sort by a column that does not exist', () => {
      return request(app)
        .get('/api/articles?sort_by=nothing')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid Query');
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
      it('PATCH: status code 200 and responds with the article with an incremented vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
          .expect(200)
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
      it('PATCH: status code 200 and responds with the article with a decremented vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -10 })
          .expect(200)
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
      it('PATCH: status 200 when no value has been provided for the vote countm responds with an unchanged article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 0 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(100);
          });
      });
      it('PATCH: status 200 when there is no information in the request body.  Responds with the unchanged article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(100);
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
    describe('POST: /:article_id/comments', () => {
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
      it('POST: status code 404 when invalid article id is requested', () => {
        return request(app)
          .post('/api/articles/999/comments')
          .send({ username: 'rogersop', body: 'Hello, this is a test' })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Not Found');
          });
      });
      it('POST: status code 404 when invalid username is used', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'bobby', body: 'Hello, this is a test' })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Not Found');
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
            expect(res.body.msg).to.equal('Missing Required Information');
          });
      });
      it('POST: status code 400 when an empty object without the username and comment has been provided', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({})
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Missing Required Information');
          });
      });
      describe('GET: /:article_id/comments', () => {
        it('GET: status code 200 and responds with an array of comments for a given article ID', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(res => {
              expect(res.body.comments[0].article_id).to.equal(1);
              expect(res.body.comments.length).to.equal(13);
              expect(res.body.comments[0]).to.contain.keys(
                'comment_id',
                'author',
                'created_at',
                'votes',
                'body'
              );
            });
        });
        it('GET: status code 200 and responds with an array of comments for a given article ID sorted by created_at in descending order by default', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.descendingBy('created_at');
            });
        });
        it('GET: status code 200 and reponds with an array of comments for a given article ID sorted by created_at as default but is ascending order when specified', () => {
          return request(app)
            .get('/api/articles/1/comments?order=asc')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sortedBy('created_at');
            });
        });
        it('GET: status code 200 and responds with an array of comments for a given article ID sorted by a specified coloumn in ascending order', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sortedBy('comment_id');
            });
        });
        it('GET: status code 200 and responds with an array of comments for a given article ID sorted by a specific column in descending order', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=votes&order=desc')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.descendingBy('votes');
            });
        });
        it('GET: status code 400 when trying to sort by a column that does not exist', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=name')
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal('Invalid Query');
            });
        });
        it('GET: status code 200 when the order query is invalid, responds with comments sorted by created_at as default', () => {
          return request(app)
            .get('/api/articles/1/comments?order=lowest')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sortedBy('created_at');
            });
        });
        it('GET: status code 404 when article id does not exists', () => {
          return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal('Article 999 Does Not Exist');
            });
        });
        it('Invalid Method: status code 405', () => {
          const invalidMethods = ['put', 'delete', 'patch'];
          const methodPromise = invalidMethods.map(method => {
            return request(app)
              [method]('/api/articles/:article_id/comments')
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
  describe('/comments', () => {
    describe('/comments/:comment_id', () => {
      it('PATCH: status code 200, returns an incremented count for a specified comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(26);
            expect(res.body.comment.comment_id).to.equal(1);
          });
      });
      it('PATCH: status code 404 when comment id does not exist', () => {
        return request(app)
          .patch('/api/comments/999')
          .send({ inc_votes: 10 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Comment 999 Not Found');
          });
      });
      it('PATCH: status code 400 when comment id is invalid', () => {
        return request(app)
          .patch('/api/comments/abc')
          .send({ inc_votes: 10 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Input');
          });
      });
      it('PATCH: status code 400 when an invalid vote value is passed', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'NoVote' })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid Input');
          });
      });
      it('PATCH: status code 200 and response with an unchanged comment when no key is invalid', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ invalidKey: 10 })
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(16);
          });
      });
      it('DELETE: status code 204 and comment is deleted', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
      it('DELETE: status code 404 when comment id does not exist', () => {
        return request(app)
          .delete('/api/comments/999')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Comment 999 Not Found');
          });
      });
      it('Invalid Method: status code 405', () => {
        const invalidMethods = ['get', 'post', 'put'];
        const methodPromise = invalidMethods.map(method => {
          return request(app)
            [method]('/api/comments/:comment_id')
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
