const Jimp = require("jimp")
const getData = require("./data_handler.js").getData

var nameFont, districtFont, updatedFont, gradeFont, locPortrait, locDistrict, locName, locVoting, locRhetoric, locDonation, locUpdated, template, portraitScale

class Generator {
  constructor(Config) {
    this.config = require("./template.json")
    this.template = undefined
  }
  async getConfig(config) {


    this.template = config.template

    this.locPortrait = config.location.portrait
    this.locDistrict = config.location.district
    this.locName = config.location.name
    this.locVoting = config.location.voting
    this.locRhetoric = config.location.rhetoric
    this.locDonation = config.location.donation
    this.locUpdated = config.location.updated
    this.portraitScale = config.portrait_scale

    this.nameFont = await Jimp.loadFont(config.fonts.name_font.file)
    this.districtFont = await Jimp.loadFont(config.fonts.district_font.file)
    this.updatedFont = await Jimp.loadFont(config.fonts.updated_font.file)
    this.gradeFont = await Jimp.loadFont(config.fonts.grade_font.file)
  }

  async makeReportCard(data) {
    if (!this.template) {
      await this.getConfig(this.config)
    }
    console.log(this.locPortrait);
    var portraitPromise = Jimp.read(data.img_link)  // TODO: get img from online
    var templatePromise = Jimp.read("./kcggrading_blank.png")


    return Promise.all([portraitPromise, templatePromise])
    .then(async(result) => {
      console.log(result);
      let scaledPortrait = result[0].cover(this.portraitScale.x, this.portraitScale.y)
      let reportCard = this.combineIMG(scaledPortrait, result[1])
      let card = this.printText(reportCard, data)
      let mime_card = await card.getBufferAsync(Jimp.MIME_JPEG)
      return mime_card
    })
    .catch(err => console.error(err))
  }

  combineIMG(portrait, base) {
    // portrait.mask(base, -58, -62)
    return base.composite(portrait, this.locPortrait.x, this.locPortrait.y, {mode:Jimp.BLEND_DESTINATION_OVER})
  }

  printText(templateObj, data) {
    let date = "February 2, 2019"
    let updatedStr = `Updated: ${date}`
    let d = Jimp.measureText(this.updatedFont, `Updated: ${date}`)

    return templateObj
    .print(this.nameFont, this.locName.x, this.locName.y, data.name)
    .print(this.updatedFont, this.locUpdated["-x"]-d, this.locUpdated.y,  updatedStr)
    .print(this.districtFont, this.locDistrict.x, this.locDistrict.y, data.district)
    .print(this.gradeFont, this.locVoting.x, this.locVoting.y, data.grades.Voting)
    .print(this.gradeFont, this.locRhetoric.x, this.locRhetoric.y, data.grades.Rhetoric)
    .print(this.gradeFont, this.locDonation.x, this.locDonation.y, data.grades.Donation)

  }

}

module.exports = new Generator()

let gg = new Generator()
let data = { "img_link":
     "https://leg.colorado.gov/sites/default/files/styles/width_300/public/2019a_rsz_arndt-co-17.jpg?itok=JjJAv3JQ",
    "district": "24",
    "leg_page": "/legislators/jessie-danielson",
    "last": "Danielson",
    "party": "Democrat",
    "last_updated": "8/6/2018",
    "phone_num": "303-866-5522",
    "grades": { "Rhetoric": "\u2205", "Voting": "A", "Donation": "B" },
    "first": "Jessie",
    "email": "jessie.danielson.house@state.co.us",
    "name": "Jessie Danielson",
    "tags":
     [ "Representative",
       "Jessie Danielson",
       "24",
       "Democrat",
       "303-866-5522",
       "jessie.danielson.house@state.co.us",
       "/legislators/jessie-danielson",
       "Danielson",
       "Jessie",
       "https://leg.colorado.gov/sites/default/files/styles/width_300/public/2018a_rsz_danielson-co-17.jpg?itok=DYr_49DF",
       "71repdanielson24",
       "8/6/2018",
       "Representative",
       "Jessie Danielson",
       "24",
       "Democrat",
       "303-866-5522",
       "jessie.danielson.house@state.co.us",
       "/legislators/jessie-danielson",
       "Danielson",
       "Jessie",
       "https://leg.colorado.gov/sites/default/files/styles/width_300/public/2018a_rsz_danielson-co-17.jpg?itok=DYr_49DF",
       "71repdanielson24",
       "8/6/2018",
       "B",
       "\u2205",
       "A" ],
    "id": "71repdanielson24",
    "title": "Representative" }

gg.makeReportCard(data).then((thing) => {
  console.log(thing);
}).catch(err => console.log(err))
