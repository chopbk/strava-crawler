module.exports = {
    production: {
        url:
            "mongodb+srv://tamnd12:tamhaha123@cluster0-7cxz7.gcp.mongodb.net/strava?retryWrites=true&w=majority",
        options: {
            poolSize: 10,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            autoIndex: true, //this is the code I added that solved it all
            keepAlive: true,
            useFindAndModify: false,
        },
    },
    dev: {
        url:
            "mongodb+srv://tamnd12:tamhaha123@cluster0-7cxz7.gcp.mongodb.net/strava?retryWrites=true&w=majority",
        options: {
            poolSize: 10,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            autoIndex: true, //this is the code I added that solved it all
            keepAlive: true,
            useFindAndModify: false,
        },
    },
    test: {
        url:
            "mongodb+srv://tamnd12:tamhaha123@cluster0-7cxz7.gcp.mongodb.net/strava?retryWrites=true&w=majority",
        options: {
            poolSize: 10,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            autoIndex: true, //this is the code I added that solved it all
            keepAlive: true,
            useFindAndModify: false,
        },
    },
};
