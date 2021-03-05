var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var url = "mongodb://localhost:27017/Magasin";

/**
 * Search the DB for the correspending query and set 
 * the given state with the result
 * @param {RegExp} query used to search in the DB
 * @param {*} set set the found values in the state
 */
export function getArticles(query, set) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Magasin");
        var cursor = dbo.collection("articles").find(query).sort({ designation: 1 }).toArray(function (err, result) {
            if (err) throw err;

            db.close();
            set(result);
        });
    });
}