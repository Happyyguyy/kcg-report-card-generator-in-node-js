const admin = require("firebase-admin");

const serviceAccountJSON = "./kcg-legislator-report-card-firebase-adminsdk-hnddn-6b0bedb31d.json"
const serviceAccount = require(serviceAccountJSON);

var db;
var LookupScope;

async function initFirebase() {

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kcg-legislator-report-card.firebaseio.com"
  });
  db = await admin.firestore();
  LookupScope = db.collection("LookupTable")
  return db;
}

async function searchQuery(searchTerms) {
  var query = LookupTable
  if (typeof(searchTerms) == 'string') {
// TODO: create looping search
    terms = searchTerms.split(" ")
  }
  for (each of terms) {
    query = query.where("tags", "array-contains", each)


  }
}

async function getScope(id) {
  return await LookupScope.doc(id).get("path") // returns documentReference
}

async function postData(data, collectionScope) {
  if (!collectionScope && collectionScope.constructor.name != "CollectionReference") {
    throw "Scope is not a collection"
  }

  // tag creator
  data.tags = []
  for (let each of Object.values(data)) {
    if (each.constructor.name === "Array") {
      data.tags = data.tags.concat(each)
    } else if (each.constructor.name == "Object") {
      data.tags =data.tags.concat(Object.values(each))
    } else {
      data.tags.push(String(each))
    }

  }
  var doc = await collectionScope.add(data)
  postLookup(doc.id, doc, data.tags)

  return doc
}

async function updateData(scope, data) {
  if (scope.constructor.name !== "DocumentReference") {
    throw "Scope is not a document"
  } else {
    scope = await getScope(scope)
  }
  data.tags = Object.values(data).map(each => String(each))
  console.log(data);
  return await documentScope.update(data)
}

async function getData(id) {
  let query = await LookupScope.doc(id).get("path");
  let documentReference = await query.get("path")
  return await documentReference.get("path") // returns documentSnapshot
  return documentSnapshot
}

async function postLookup(id, ref, tags) {
  if (ref.constructor.name != "DocumentReference") {
    throw "ref is not document reference"
  }
  return await LookupScope.doc(id).set({path: ref, tags:tags})
}


module.exports = {
  getData: getData,
  initFirebase: initFirebase,
  postData: postData,
  updateData: updateData,
  postLookup: postLookup,
  getScope: getScope
}
