import mongoose from "mongoose";
import express from "express";
import log from "morgan";
import bodyParser from "body-parser";
import router from "./router/router";
import swaggerSettings from "./swagger.js";
import expressSwagger from "express-swagger-generator";

async function main() {
    try {
        mongoose.Promise = global.Promise;
        // Should be moved to a settings file in future.
        await mongoose.connect("mongodb://localhost:27017/noteman", { useNewUrlParser: true });
        console.log("connected to Database ---");
        

        const app = express();
        const server = app.listen(process.env.PORT || 3000);
        console.log("Server is running on port: ", process.env.PORT || 3000);

        app.use(log("dev"));
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
            res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
            );
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });

        // Generate documentation
        const swagger = expressSwagger(app);
        swagger(swaggerSettings);

        router(app);
    } catch (error) {
        if(error.name == "MongoNetworkError") {
            console.log("Could not connect to mongodb, error => ", error);
            return;
        }
        console.log("error stuff:", error);
    }
}



main();