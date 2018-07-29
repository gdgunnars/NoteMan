module.exports = swaggerSettings = {
    swaggerDefinition: {
        info: {
            description: "This is the API Documentation for NoteMan",
            title: "NoteMan",
            version: "0.0.1",
        },
        host: "localhost:3000",
        basePath: "/",
        produces: [
            "application/json"
        ],
        schemes: ["http", "https"],
        /*securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }*/
    },
    basedir: __dirname, //app absolute path
    files: ["./router/**/*.mjs", "./models/**/*.mjs"] //Path to the API handle folder
};

