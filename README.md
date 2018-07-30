# NoteMan API

NoteMan is a personal note taking API. It supports uploading multiple files up to 16MB for each note & set reminders at specific times.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The backend depends on NodeJS and MongoDB. It is originally developed on Ubuntu 18.04 but you can follow the installation instruction for your operating system on the projects website.

[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

[MongoDB](https://docs.mongodb.com/manual/installation/)

[NodeJS](https://nodejs.org/en/download/)

We highly recommend using a version manager for node like [NVM](https://github.com/creationix/nvm).

## Installing
*Notice! the latter expects you are installing on Ubuntu, you can follow along with most of the commands for other operating systems but keep this in mind.*

After installing both MongoDB and NVM we will start by installing the newest stable release of Node which is 10.7.0 at the time of writing.
```
nvm install 10.7.0
``` 

If you just installed NVM, this will set the default to use 10.7.0, but if you where using another version execute `nvm use 10.7.0`.


If you haven't already, now is the time to clone the repo
```
git clone git@git.mikligardur.com:gdgunnars/NoteMan.git
```

### Install node dependencies
cd into the newly created NoteMan directory ( `cd NoteMan` ) and run 

```
npm install
```

### All set up
Now everything should be set up and you can just run it with
```
npm start
```

Please keep in mind that we have the `--experimental-modules` flag enabled since we are using es6 import instead of require() to eliminate the use of Babel.

## Running the tests

Currently there are no automated tests.

## Built With

* [VS Code](https://code.visualstudio.com/Download) - Code editor
* [NodeJS](https://nodejs.org) - JavaScript runtime
* [MongoDB](https://www.mongodb.com/) - Document-oriented database program.
* [Express](https://expressjs.com/) - Web application framework
* [Mongoose](http://mongoosejs.com/) - MongoDB object modeling
* [Agenda](http://agendajs.com) - Lightweight job scheduling for Node.js 

*and [more](https://git.mikligardur.com/gdgunnars/NoteMan/blob/master/package.json)*

## Authors

* **Gunnar Davíð** - [GDGunnars(self hosted)](http://git.mikligardur.com/gdgunnars) / [github](https://github.com/gdgunnars)
