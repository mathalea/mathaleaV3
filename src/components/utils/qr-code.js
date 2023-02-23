import QRCode from 'qrcode'

const allowedImageFormats = ['image/jpeg', 'image/png', 'image/webp']
// const formatQRCodeIndex = 0
// const QRCodeWidth = 100
/**
 * Generate QR-Code from current URL and display it in designated image
 * (format is decided by global variable <i>formatQRCodeIndex</i>)
 * @param imageId id of the image
 * @param QRCodeWidth largeur du QR-Code (en pixels)
 * @param formatQRCodeIndex code du format d'image (voir allowedImageFormats)
 * @author sylvain
 */
export function urlToQRCodeOnWithinImgTag (imageId, QRCodeWidth, formatQRCodeIndex = 0) {
  const diapoURL = document.URL
  const options = {
    errorCorrectionLevel: 'H',
    type: allowedImageFormats[formatQRCodeIndex],
    quality: 0.9,
    margin: 1,
    scale: 2,
    width: QRCodeWidth,
    color: {
      dark: '#000',
      light: '#fff'
    }
  }
  QRCode.toDataURL(diapoURL, options, (err, url) => {
    if (err) throw err
    const img = document.getElementById(imageId)
    img.src = url
  })
}

/**
* Download image of QR-Code contained within designated img tag
* (timestamp is added to the file name)
* @param imageId ID of the image to download
* @param formatQRCodeIndex code du format d'image (voir allowedImageFormats)
* @author sylvain
*/
export function downloadQRCodeImage (imageId, formatQRCodeIndex = 0) {
  // creating a timestamp for file name
  const date = new Date()
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const timestamp = `${year}${month}${day}`

  const imageSrc = document.getElementById(imageId).getAttribute('src')
  fetch(imageSrc)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      // creating virtual link for download
      const downloadLink = document.createElement('a')
      downloadLink.style.display = 'none'
      downloadLink.href = url
      downloadLink.download = 'qrcode_diapo_coopmaths' + timestamp + '.' + allowedImageFormats[formatQRCodeIndex].slice(6)
      document.body.appendChild(downloadLink)
      downloadLink.click()
      window.URL.revokeObjectURL(url)
    })
    .catch(() => "Erreur avec le téléchargement de l'image du QR-Code")
}
