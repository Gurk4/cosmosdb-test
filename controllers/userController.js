const { DocumentClient, DocumentBase } = require('documentdb');
const connectionPolicy = new DocumentBase.ConnectionPolicy();
connectionPolicy.DisableSSLVerification = true;

var config = require("../config");
var url = require('url');

const client = new DocumentClient(config.host, { masterKey: config.authKey }, connectionPolicy);
// var client = new DocumentClient(config.host, { masterKey: config.authKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

function getDatabase() {
    console.log(`Getting database:\n${config.database.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDatabase(config.database, (err, created) => {
                        if (err){
                            reject(err)
                        }
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

function getCollection() {
    console.log(`Getting collection:\n${config.collection.id}\n`);

    return new Promise((resolve, reject) => {
        client.readCollection(collectionUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createCollection(databaseUrl, config.collection, { offerThroughput: 400 }, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

function getFamilyDocument(id) {
    let documentUrl = `${collectionUrl}/docs/${id}`;
    console.log(`Getting document:\n${id}\n`);

    return new Promise((resolve, reject) => {
        client.readDocument(documentUrl, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

function postFamilyDocument(document){
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Getting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDocument(documentUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDocument(collectionUrl, document, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

function promiseFamilyDocument(id){
    return getDatabase()
    .then(() => getCollection())
    .then(() => getFamilyDocument(id));
    // .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) }); 
}

function exit(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

module.exports = {promiseFamilyDocument}