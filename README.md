# Saffron 

- yo angular-fullstack:endpoint Endpoint-name


## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.com/)


##certificate Add
- https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2

##Tutorial about the Docker.
- https://github.com/sacredMonster/fast-tutorials


#Live Mongo Db on server for linux

###Step - 1
- Install the mongodb on the sever. Note - Make sure you are installing MongoDb with service. 

###Step - 2 
- sudo nano /etc/mangod.conf - mongodb configuration code.

#####Create user 
``` 
    > use admin
    > db.createUser({
      user: "gygadmin",
      pwd: "gyg123",
      roles: [
                { role: "userAdminAnyDatabase", db: "admin" },
                { role: "readWriteAnyDatabase", db: "admin" },
                { role: "dbAdminAnyDatabase",   db: "admin" }
             ]
  });
  ```
  
###Step - 3
- ``` sudo nano /etc/init.d/mongod ``` (if you want to run mongodb as an authentication). - service code. 
add --auth in command field. 

###Mongoose Connection string change
- Connection Url: `'mongodb://{userName}:{password}@{host}:{port}/{DBname}?authSource={dbname}'`
- Connection Url: `'mongodb://gygadmin:gyg123@dev.driveby.guzmanygomez.com:27017/UberEatsMenu_dev?authSource=admin'`


##Git Configuration 
`git checkout -b Developer origin/feature/Developer` 

`git pull origin feature/Developer`

`sudo npm run-script build`
