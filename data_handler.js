const admin = require("firebase-admin");

const serviceAccountJSON = "./kcg-legislator-report-card-firebase-adminsdk-hnddn-6b0bedb31d.json"
const serviceAccount = require(serviceAccountJSON);

var db;
var LookupScope;
// num is assembly number
var legNumber;

async function initFirebase(num=71) {

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kcg-legislator-report-card.firebaseio.com"
  });
  db = await admin.firestore();
  LookupScope = db.collection("LookupTable")
  module.exports.LookupScope = LookupScope

  legNumber = String(num)
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
  doc.update({id: doc.id})
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

async function getAll(config) {
  let geoScope = "State"
  let house = "all"
  if (config) {
    if (config.geoScope) {geoScope = String(config.geoScope)}
    if (config.legNumber) {let legNumber = String(config.legNumber)}
    if (config.house) {house = String(config.house)}
  }

  var data = []
  if (house == "all") {
    let subCollections = await db.collection(geoScope).doc(legNumber).getCollections();
    // subCollections.forEach((collection) => {
    //   collection.get().then(() => {
    //     documents.forEach((doc) => {
    //       let docData = doc.data()
    //       // console.log(docData);
    //       data.push(docData)
    //     })
    //   })
    // })
    for (let collection of subCollections) {
      let documents = await collection.get();
      for (let doc of documents.docs) {
        data.push(doc.data());
      }
    }
    return data;
  }
}

module.exports = {
  getData: getData,
  initFirebase: initFirebase,
  postData: postData,
  updateData: updateData,
  postLookup: postLookup,
  getScope: getScope,
  getAll: getAll,
};
