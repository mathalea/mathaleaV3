import { globalOptions } from '../store'
import { get } from 'svelte/store'
/**
   * Construit les éléments à ajouter à l'URL afin d'accéder à la vue élève
   * @returns {string} chaîne à ajouter
   * @author sylvain
   */
export function buildUrlAddendumForEsParam () {
  const options = get(globalOptions)
  const presentationMode = new Map([
    ['page', 0],
    ['exos', 1],
    ['liste', 2],
    ['question', 3]
  ])
  let addendum = '&v=eleve&title=' + options.title
  // Paramètre 'es' : presMode|setInteractive|isSolutionAccessible|isInteractiveFree
  addendum += '&es=' + presentationMode.get(options.presMode)
  addendum += options.setInteractive
  addendum += options.isSolutionAccessible ? '1' : '0'
  addendum += options.isInteractiveFree ? '1' : '0'
  return addendum
}

export async function getShortenedCurrentUrl (addendum = '') {
//   const url = document.URL + addendum
  const url = 'https://coopmaths.fr/beta/?uuid=322a0&id=6C10-0&alea=uf2K&uuid=a5c5a&id=6C10-3&alea=3yIA&uuid=fd4d8&id=6C10-5&alea=yuEs&v=eleve&title=Exercices&es=1111'
  console.log('url to be shortened : ' + url)
  console.log('url to be fetched : ' + `https://api.shrtco.de/v2/shorten?url=${url}`)
  let response
  try {
    const request = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`)
    response = await request.json()
  } catch (error) {
    console.log(error)
  }
  const shortUrl = '' + response.result.full_short_link
  console.log('url shortened : ' + shortUrl)
  return '' + shortUrl
}

/**
 * Encrypte la partie de l'URL après le point d'interrogation '?'
 * Principe : on ajoute 'EEEE' après le '?' pour reconnaître une URL encryptée
 * par la suite et on remplace chaque caractère de la vraie URL par le caractère
 * UTF8 7 rangs après...
 * @param {string} url URL a encrypter
 * @returns {string} URL encryptée
 * @author sylvain
 */
export function crypt (url) {
  const urlParts = url.split('?')
  let newUrl = urlParts[0] + '?EEEE'
  for (let i = 0; i < urlParts[1].length; i++) {
    newUrl += String.fromCharCode(urlParts[1].charCodeAt(i) + 7)
  }
  return newUrl
}

/**
 * Décrypte _si besoin_ une URL sur la base du cryptage précédent
 * @param {string} url URL à décrypter
 * @returns {string} URL décryptée
 * @author sylvain
 */
export function uncrypt (url) {
  const part1 = url.slice(0, url.indexOf('?'))
  const part2 = url.replace(part1 + '?', '')
  let newUrl = ''
  if (part2.substring(0, 4) !== 'EEEE') {
    newUrl = url
  } else {
    newUrl = part1 + '?'
    const urlPart2 = part2.slice(4, part2.length)
    for (let i = 0; i < urlPart2.length; i++) {
      newUrl += String.fromCharCode(urlPart2.charCodeAt(i) - 7)
    }
  }
  return newUrl
}
