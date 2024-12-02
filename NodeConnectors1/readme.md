# Project Connector APIs

## Description
Project is built in Node.js, using MongoDB as the primary database for storing user information. In addition to this, the system incorporates a Spring Boot API for efficient data processing. To enhance data retrieval and search capabilities, OpenSearch is utilized for storing and managing users' data sources.

## Features
- stores user and thier connectors config data in mongodb
- support for major datasource connector
- datasource scanning through list,download,delete apis

### Instructions to Learn
1. Study Environment Variables, just set MongoURI and it will create database and collection automatically if not exist.
2. Study Postman collection of API, start with register/login API.
3. To use connector API, set your configs accordingly in request body.

### Data Flow:
- Config folder contains mongodb connection
- Request <-> Routes <-> Middleware <-> Controller <-> Services <-- Config/Node_Modules
- Middlewares to process request object (Token validation/Connection Provider/Json Validation) and pass to controller
- Controllers communicate with services by sending relevant data and receving status/results from services
- Services contains actual business logic

### Instructions for Testing
1. We have not included any console.log statements in code, just error messages will be logged and displayed.
2. For Testing, just add log statements to particular middlewares, controllers and services to know what's going on.

## Installation

1. Clone the repository:
   ```bash
   git clone

2. Install npm packages: `npm i`
3. Run the project: `npm start`
   development mode: `npm run dev`
4. Build docker-image: `docker build -t connector .` 

### Developer Guide:
- Mark comments with `TO DO: Details` wherever needs improvements or need to find better solution later.
- Please Maintain Postman API Collection and also include api details in this readme file
- AI generated code is not allowed for good of human brain!

### USER API:
Body: raw (json)

1. POST `http://localhost:5000/api/user/register` 
{
    "username": "himay",
    "email": "himay@gmail.com",
    "password": "himay",
    "confirmpassword": "himay"
}

2. GET `http://localhost:5000/api/user/login`
{
    "username": "himay",
    "email": "himay@gmail.com",
    "password": "himay"
}
Note: returns JWT token

3. POST `http://localhost:5000/api/config/store`
Authorization: Bearer <Token>
{
    "mysql": {
    "host": "localhost",
    "user": "root",
    "database": "information_schema",
    "port": 3306,
    "password": "",
    "connectionLimit": 10
   },
   "s3": {
        "awsAccessKey": "",
        "awsSecretKey": "",
        "awsRegion": "eu-west-1"
    }
}

4. GET `http://localhost:5000/api/config/fetch`
Authorization: Bearer <Token>
Note: returns config


### MySQL API:
Authorization: Bearer <Token>
Body: raw (json)

1. GET `http://localhost:5000/api/mysql/list`
{
    "mysql": {
        "host": "localhost",
        "user": "root",
        "database": "information_schema",
        "port": 3306,
        "password": ""
    }
}

2. GET `http://localhost:5000/api/mysql/download`
{
    "mysql": {
        "host": "localhost",
        "user": "root",
        "database": "information_schema",
        "port": 3306,
        "password": ""
    }
}

3. DELETE `http://localhost:5000/api/mysql/delete`
{
    "mysql": {
        "host": "localhost",
        "user": "root",
        "database": "information_schema",
        "port": 3306,
        "password": ""
    }
}


### AWS-S3 API:
Authorization: Bearer <Token>
Body: raw (json)

1. GET `http://localhost:5000/api/s3/list`
{
    "s3": {
        "awsAccessKey": "",
        "awsSecretKey": "",
        "awsRegion": "eu-west-1"
    }
}

2. GET `http://localhost:5000/api/s3/download`
{
    "s3": {
        "awsAccessKey": "",
        "awsSecretKey": "",
        "awsRegion": "eu-west-1"
    }
}

3. DELETE `http://localhost:5000/api/s3/delete`
{
    "s3": {
        "awsAccessKey": "",
        "awsSecretKey": "",
        "awsRegion": "eu-west-1"
    }
}


### MONGO API:
Authorization: Bearer <Token>
Body: raw (json)

1. GET `http://localhost:5000/api/mongo/list`
{
    "mongo": {
        "uri": "mongodb://localhost:27017",
        "databaseName": "local"
    }
}

2. GET `http://localhost:5000/api/mongo/download`
{
    "mongo": {
        "uri": "mongodb://localhost:27017",
        "databaseName": "local"
    }
}

3. DELETE `http://localhost:5000/api/mongo/delete`
{
    "mongo": {
        "uri": "mongodb://localhost:27017",
        "databaseName": "local"
    }
}


### PostgreSQL API:
Authorization: Bearer <Token>
Body: raw (json)

1. GET `http://localhost:5000/api/postgres/list`
{
    "postgres": {
        "host": "localhost",
        "user": "postgres",
        "database": "test",
        "port": 5432,
        "password": "Postgres"
    }
}

2. GET `http://localhost:5000/api/postgres/download`
{
    "postgres": {
        "host": "localhost",
        "user": "postgres",
        "database": "test",
        "port": 5432,
        "password": "Postgres"
    }
}

3. DELETE `http://localhost:5000/api/postgres/delete`
{
    "postgres": {
        "host": "localhost",
        "user": "postgres",
        "database": "test",
        "port": 5432,
        "password": "Postgres"
    }
}


### Opensearch API:
Authorization: Bearer <Token>
Body: raw (json)

1. GET `http://localhost:5000/api/opensearch/list`
{
    "opensearch": {
        "uri": "http://localhost:9200"
    }
}

2. GET `http://localhost:5000/api/opensearch/download`
{
    "opensearch": {
        "uri": "http://localhost:9200"
    }
}

3. DELETE `http://localhost:5000/api/opensearch/delete`
{
    "opensearch": {
        "uri": "http://localhost:9200"
    }
}