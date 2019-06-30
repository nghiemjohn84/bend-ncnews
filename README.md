# **Northcoders News API**

## **About**

This project is the development of a RESTful API for Northcoders News built using PostgreSQL, Knex, Node and Express.  

The API provides the means of retrieving information from specific endpoints with the use of queries, but also allows posting, updating or deleting of information


# **Getting started**

## **Prerequisites**

**Dependencies**
* knex 0.17.6
* PostGresQL 11
* Node Postgres 7.11.0

**Dev Dependencies**
* Express 4.17.1
* Chai 4.2.0
* Chai-sorted 0.2.0
* Mocha 6.1.4
* Supertest 4.0.2
* Nodemon 1.19.1

# **Installing**

**1.** **In order to run the project, firstly fork the repository then clone the contents onto your local machine using the terminal commands below:**

```
$ git clone https://github.com/<your-github-username>/be-nc-news
```
**2.** **Once cloned, navigate into the cloned folder and open the the folder in your code editor:**
```
$ cd be-nc-news
$ code .
```
**3.** **Install the necessary dependencies by running the following command:**
```
$ npm install
```
**4.** **Create a file in the root directory named knexfile.js and insert the following code below:**

*Please note: if you are using a Linux based system, you are required to input your postgreSQL username and password.*

```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: 'nc_news'
      // username,
      // password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      // username,
      // password
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

**5.** **In order to setup the databases, run the following commands in order in your terminal:**
```
$ npm run setup-dbs

$ npm run seed
```

**6.** **Finally, the server is defaulted to run on port 9090.  All endpoints can be found locally at:**
```
http://localhost:9090
```
# **Running Tests**

Included with this repository is a test suite to assert that the output at each endpoint conforms to certain testing criteria. To run the tests, input the following command in your terminal:
```
$ npm test
```
## **Testing**

### **Testing is carried out for each route**
```
GET /api/users/:username
```
Tests to ensure that the response is an array of all user data.  Responds with an error if the route is not found or method is not allowed.
```
GET /api/topics
```
Tests to ensure that the response is an array of all topic data.  Responds with an error if the route is not found or method is not allowed.
```
GET /api/articles
```
Tests to ensure that the response is an array of articles containing specific keys.  Also ensuring that the queries are valid and responds with data as per the query. 
```
GET /api/articles/:article_id
```
Tests to ensure that the response is specific to an article ID.  Responds with an error if the article ID is invalid or the method is not allowed.
```
PATCH /api/articles/:article:id
```
Tests to ensure that the vote property is updated for a specific article ID. Responds with an error if the article ID is invalid or the method is not allowed.
```
POST /api/articles/:article_id/comments
```
Tests to ensure that the response is that of a new comment posted for a specific article ID.  
```
GET /api/articles/:article_id/comments
```
Tests to ensure that the response is an array of comments for a specific article and is sorted by or ordered by a specific order based on a query or defualt values.
```
PATCH /api/comments/:comment_id
```
Tests to ensure that the response is that of an updated comment with changes made to their vote property.  Responds with an error if the comment does not exist.
```
DELETE /api/comments/:comment_id
```
Tests to ensure that a specific comment is deleted.  Responds with an error if the comment does not exist.

# **Deployment**
The app has been deployed to Heroku and will be updated regularly as the development of tha app progresses.

[nc-news-jn](https://nc-news-jn.herokuapp.com/)

# **Author**
John Nghiem 

[github](https://github.com/nghiemjohn84)

# **Acknowledgements**
Northcoders





