const Firebase = require("./data_handler.js")
const CsvToJson = require("csvtojson")


async function upload() {

  const csvFilePath = "./leglist_new.csv"
  var db = await Firebase.initFirebase()
  const ReprScope = db.collection("State").doc("71").collection("Representatives")
  const SenScope = db.collection("State").doc("71").collection("Senate")
  const LookupScope = db.collection("LookupTable").doc("0")

  CsvToJson()
  .fromFile(csvFilePath)
  .then(json => {
    const grades = require("./Co_Leg_Grades_08_30_2018.json")
    json.forEach(each => {
      // add last updated to data
      each.last_updated = grades[each.id]["last_updated"]
      // delete last updated from grades data
      delete grades[each.id]["last_updated"]
      // create tags with data and grades
      let tags = Object.values(each).concat(Object.values(grades[each.id]))
      each.tags = tags
      // add grades to data
      each.grades = grades[each.id]

      //push data by scope.
      if (each.title == "Senator") {
        Firebase.postData(each, SenScope)
      } else if (each.title == "Representative") {
        Firebase.postData(each, ReprScope)
      }
    })
  })
}

upload().catch(err => console.error(err))
