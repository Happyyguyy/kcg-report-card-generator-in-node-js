const Jimp = require("jimp")
const getData = require("./data_handler.js").getData

var nameFont, districtFont, updatedFont, gradeFont, locPortrait, locDistrict, locName, locVoting, locRhetoric, locDonation, locUpdated, template, portraitScale


async function getConfig() {
  let config = require(configFile)

  template = config.template

  locPortrait = config.location.portrait
  locDistrict = config.location.district
  locName = config.location.name
  locVoting = config.location.voting
  locRhetoric = config.location.rhetoric
  locDonation = config.location.donation
  locUpdated = config.location.updated
  portraitScale = config.portrait_scale

  nameFont = await Jimp.loadFont(config.fonts.name_font.file)
  districtFont = await Jimp.loadFont(config.fonts.district_font.file)
  updatedFont = await Jimp.loadFont(config.fonts.updated_font.file)
  gradeFont = await Jimp.loadFont(config.fonts.grade_font.file)
}


async function makeReportCard(id) {
  var data = getData(SCOPE, id)  // figure out scope

  var portraitPromise = Jimp.read("./temp.jpg")  // TODO: get img from online

  var templatePromise = Jimp.read("./kcggrading_blank.png")


  return Promise.all([portraitPromise, templatePromise])
    .then(result => {
      let scaledPortrait = result[0].cover(portraitScale.x, portraitScale.y)
      let reportCard = combineIMG(scaledPortrait, result[1])
      return printText(reportCard, data).write("./test2.jpg")
    })
    .catch(err => console.error(err))

  function combineIMG(portrait, base) {
    // portrait.mask(base, -58, -62)
    return base.composite(portrait, locPortrait.x, locPortrait.y, {mode:Jimp.BLEND_DESTINATION_OVER})
  }

  function printText(templateObj, data) {
      let date = "February 2, 2019"
      let updatedStr = `Updated: ${date}`
      let d = Jimp.measureText(updatedFont, `Updated: ${date}`)

      return templateObj
      .print(nameFont, locName.x, locName.y, data.name)
      .print(updatedFont, locUpdated["-x"]-d, locUpdated.y,  updatedStr)
      .print(districtFont, locDistrict.x, locDistrict.y, data.district)
      .print(gradeFont, locVoting.x, locVoting.y, data.voting)
      .print(gradeFont, locRhetoric.x, locRhetoric.y, data.rhetoric)
      .print(gradeFont, locDonation.x, locDonation.y, data.donations)

  }
}

async function generateOne(id) {
  var nameFont, districtFont, updatedFont, gradeFont, locPortrait, locDistrict, locName, locVoting, locRhetoric, locDonation, locUpdated, template, portraitScale
  await getConfig();
  var data = await getData(scope, id)
}


module.exports = {makeReportCard: makeReportCard}
