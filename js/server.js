const fs = require('fs')
const fetch = require('node-fetch')

const json = JSON.parse(fs.readFileSync('./metroWithTransfers.json'))
const lines = json.lines

const apikey = 'c916a23a-840c-4c73-8781-bae0ea99003c'

async function addPosition(line, station) {
  const searchString = `метро ${station.title} Москва`
  const url = encodeURI(
    `https://geocode-maps.yandex.ru/1.x/?apikey=${apikey}&geocode=${searchString}&results=100&format=json`
  )
  console.log(url)
  const response = await fetch(url)
  const data = await response.json()

  console.log(data)

  let GeoObject

  if (data.response.GeoObjectCollection.featureMember.length > 1) {
    const elem = data.response.GeoObjectCollection.featureMember.find(
      (elem) => {
        if (elem.GeoObject.description.indexOf(line.title) >= 0) {
          return true
        }
        {
          return false
        }
      }
    )
    if (elem == undefined) {
      GeoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject
    } else {
      GeoObject = elem.GeoObject
    }
  } else {
    GeoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject
  }

  const coordinates = GeoObject.Point.pos.split(' ')

  station.pos = {
    lat: coordinates[0],
    lng: coordinates[1],
  }
}

async function start() {
  for (line of lines) {
    for (station of line.stations) {
      await addPosition(line, station)

      const data = JSON.stringify({ lines: lines })
      fs.writeFileSync('metro.json', data)
    }
  }
}

start()
