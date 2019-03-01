var Firebase = require("./data_handler")


async function main() {
  await Firebase.initFirebase()
  var data = await Firebase.getData("2NszdqeBU6DJRTLdAYtb")
  console.log(await data.data())
}

main().catch(err => console.error(err))
