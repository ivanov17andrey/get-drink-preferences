const rows = [
  ...document
    .querySelectorAll('table.standard.sortable.jquery-tablesorter')[0]
    .querySelectorAll('tbody tr:not(.shadow)'),
  ...document
    .querySelectorAll('table.standard.sortable.jquery-tablesorter')[1]
    .querySelectorAll('tbody tr'),
  ...document
    .querySelectorAll('table.standard.sortable.jquery-tablesorter')[2]
    .querySelectorAll('tbody tr'),
]
const lineNumbers = []
const lineTitles = []
const lines = []
let stationCounter = 0

for (row of rows) {
  let number
  let title
  let hexColor
  // -1 так как третий элемент лишний и не ясно, что там вообще забыл
  for (
    let i = 0;
    i < row.children[0].querySelectorAll('.sortkey').length - 1;
    i++
  ) {
    number = row.children[0].querySelectorAll('.sortkey')[i].innerHTML
    if (row.children[0].style.background != '') {
      hexColor = rgb2hex(row.children[0].style.background)
    } else {
      const rgbArray = row.children[0].style.backgroundImage
        .replace(/\s/g, '')
        .match(/rgb\(\d+,\d+,\d+\)?/g)
      hexColor = rgb2hex(rgbArray[i])
    }

    // Удаление нулей в начале номера линии
    // if (number[0] == '0') {
    // 	number = number.slice(1)
    // }
    title = row.children[0].querySelectorAll('span[title]')[i].title
    if (!lineTitles.includes(title)) {
      lineNumbers.push(number)
      lineTitles.push(title)
      lines.push({ id: lines.length, number, title, hexColor, stations: [] })
    }
  }
}

for (row of rows) {
  const stationName =
    row.children[1].children[0].children[0] == undefined
      ? row.children[1].children[0].innerHTML
      : row.children[1].children[0].children[0].innerHTML
  console.log(stationName)
  transferToLine = []

  if (row.children[3].childElementCount != 0) {
    for (span of row.children[3].querySelectorAll('.sortkey')) {
      const number = span.innerHTML
      const str = span.nextSibling.title
      if (number != '011А') {
        transferToLine.push({ number: number, str })
      }
    }
  }

  for (element of row.children[0].querySelectorAll('span[title]')) {
    const title = element.title
    const line = lines.find((el) => {
      return el.title == title
    })
    line.stations.push({
      id: stationCounter,
      order: line.stations.length,
      title: stationName,
      transferToLine,
      transferToStation: [],
    })
    stationCounter++
  }
}

for (line of lines) {
  for (station of line.stations) {
    if (station.transferToLine.length > 0) {
      for (let i = 0; i < station.transferToLine.length; i++) {
        const ourLine = lines.find((elem) => {
          if (elem.number == station.transferToLine[i].number) {
            return true
          }
          return false
        })

        station.transferToLine[i].title = ourLine.title

        for (ourStation of ourLine.stations) {
          if (station.transferToLine[i].str.includes(ourStation.title)) {
            station.transferToStation.push({
              id: ourStation.id,
              order: ourStation.order,
              title: ourStation.title,
            })
          }
        }
      }
    }
  }
}

function rgb2hex(orig) {
  let rgb = orig.replace(/\s/g, '').match(/^rgb?\((\d+),(\d+),(\d+)\)?/i),
    hex = rgb
      ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
        (rgb[2] | (1 << 8)).toString(16).slice(1) +
        (rgb[3] | (1 << 8)).toString(16).slice(1)
      : orig

  return hex.toUpperCase()
}
