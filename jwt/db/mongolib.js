const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017";

const dbName = "jwt";

const client = new MongoClient(url, { useUnifiedTopology: true });

const getDatabase = (callback) => {
  client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    callback(db, client);
  });
};

const findUsers = function (db, callback) {
  const collection = db.collection("users");
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

const createDocument = function (db, myobj) {
  const collection = db.collection("documents");
  collection.insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
};

const register = function (db, myobj) {
  const collection = db.collection("users");
  collection.insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
};

const findDocument = function (db, callback, username) {
  const collection = db.collection("users");
  collection.find({ username: username }).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

const getAllDocuments = function (db, callback) {
  const collection = db.collection("documents");
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

exports.getDatabase = getDatabase;
exports.findUsers = findUsers;
exports.findDocument = findDocument;
exports.createDocument = createDocument;
exports.getAllDocuments = getAllDocuments;
exports.register = register;