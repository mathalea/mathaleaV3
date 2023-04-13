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
  //  La ligne ci-dessous devra être celle de la version définitive
  //   const url = document.URL + addendum
  // ci-dessous, URL en dur pour test (le service ne fonctionne pas avec des localhost dans l'URL)
  const url = 'https://coopmaths.fr/beta/?uuid=322a0&id=6C10-0&alea=uf2K&uuid=a5c5a&id=6C10-3&alea=3yIA&uuid=fd4d8&id=6C10-5&alea=yuEs&v=eleve&title=Exercices&es=1111'
  let response
  try {
    const request = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`)
    response = await request.json()
  } catch (error) {
    console.log(error)
  }
  const shortUrl = '' + response.result.full_short_link
  return '' + shortUrl
}

/**
 * Encrypte la partie de l'URL après le point d'interrogation '?'
 * Principe : on ajoute 'EEEE' après le '?' pour reconnaître une URL encryptée
 * par la suite et on encode le reste de l'URL en suivant l'algorithme montré
 * [ici](https://stackoverflow.com/questions/67855828/encrypt-and-decrypt-a-string-using-simple-javascript-without-using-any-external)...
 * @param {string} url URL a encrypter
 * @returns {URL} URL encryptée
 * @author sylvain
 */
export function encrypt (url) {
  const urlParts = url.split('?')
  let newUrl = urlParts[0] + '?EEEE'
  let char, nextChar, combinedCharCode
  let partEncrypted = ''
  const partToEncrypt = encodeURI(urlParts[1])
  for (let i = 0; i < partToEncrypt.length; i += 2) {
    char = partToEncrypt.charCodeAt(i)
    if ((i + 1) < partToEncrypt.length) {
      nextChar = partToEncrypt.charCodeAt(i + 1) - 31
      combinedCharCode = char + '' + nextChar.toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
      partEncrypted += String.fromCharCode(parseInt(combinedCharCode, 10))
    } else {
      partEncrypted += partToEncrypt.charAt(i)
    }
  }
  const hexPartEncrypted = partEncrypted.split('').reduce((hex, c) => { hex += c.charCodeAt(0).toString(16).padStart(4, '0'); return hex }, '')
  newUrl += hexPartEncrypted
  return new URL(newUrl)
}

/**
 * Décrypte _si besoin_ une URL sur la base du cryptage précédent
 * @param {URL} url URL à décrypter
 * @returns {URL} URL décryptée
 * @author sylvain
 */
export function decrypt (url) {
  const oldUrl = url.href
  const part1 = oldUrl.slice(0, oldUrl.indexOf('?'))
  const part2withEEEE = oldUrl.replace(part1 + '?', '')
  let newUrl = ''
  if (part2withEEEE.substring(0, 4) !== 'EEEE') {
    newUrl = url
  } else {
    let char, codeStr, firstCharCode, lastCharCode
    let decryptedPart = ''
    newUrl = part1 + '?'
    let part2 = part2withEEEE.slice(4, part2withEEEE.length) // on enlève les `EEEE`
    part2 = part2.match(/.{1,4}/g).reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 16)), '')

    for (let i = 0; i < part2.length; i++) {
      char = part2.charCodeAt(i)
      if (char > 132) {
        codeStr = char.toString(10)
        firstCharCode = parseInt(codeStr.substring(0, codeStr.length - 2), 10)
        lastCharCode = parseInt(codeStr.substring(codeStr.length - 2, codeStr.length), 10) + 31
        decryptedPart += String.fromCharCode(firstCharCode) + String.fromCharCode(lastCharCode)
      } else {
        decryptedPart += part2.charAt(i)
      }
    }
    newUrl += decryptedPart
  }
  return new URL(newUrl)
}

/**
 * Télécharger un fichier connaissant l'URL
 * 
 * __Exemple__ 
 * ```tsx
 * downloadFileFromURL(url, 'image.jpg');
 * ```
 * 
 * __Paramètres__
 * @param {string} url URL du fichier à télécharger
 * @param {string} filename nom doné au fichier téléchargé
 * @see {@link https://blog.gitnux.com/code/javascript-download-file-from-url/}
 */
export async function downloadFileFromURL(url, filename) {
  try {
    // Fetch the file
    const response = await fetch(url);
    
    // Check if the request was successful
    if (response.status !== 200) {
      throw new Error(`Unable to download file. HTTP status: ${response.status}`);
    }

    // Get the Blob data
    const blob = await response.blob();

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;

    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(downloadLink.href);
      document.body.removeChild(downloadLink);
    }, 100);
  } catch (error) {
    console.error('Error downloading the file:', error.message);
  }
}