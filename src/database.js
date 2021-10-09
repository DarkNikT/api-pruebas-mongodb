const config = require('./config.js');
module.exports = {
    // db: "mongodb://localhost:27017/app-mispuntos",
    db: "mongodb+srv://"+ config.USER_MONGO +":" + config.PASS_MONGO + "@cluster0.ainyd.mongodb.net/app-muevetexpuntos?retryWrites=true&w=majority"

   }; 