import { showDialogForLimitedTime } from './dialogs'
import { getBlobFromImageElement, copyBlobToClipboard, canCopyImagesToClipboard } from 'copy-image-clipboard'
import { encrypt, getShortenedCurrentUrl } from './urls'

/**
   * Copy current URL to clipboard
   * @param dialogId id of dialog widget where the info is displayed
   * @param urlAddendum string to be added at the end of the URL
   * @param {boolean} shorten does the URL has to be shorten ?
   * @param {boolean} crypted does the URL need to be crypted ?
   * @author sylvain
   */
export async function copyLinkToClipboard (dialogId, urlAddendum = '', shorten = false, crypted = false) {
  let url
  if (shorten) {
    try {
      url = await getShortenedCurrentUrl(urlAddendum)
    } catch (error) {
      showDialogForLimitedTime(dialogId + '-2', 1000)
      throw error
    }
  } else {
    url = crypted ? encrypt(document.URL + urlAddendum) : document.URL + urlAddendum
  }
  navigator.clipboard.writeText(url).then(
    () => {
      showDialogForLimitedTime(dialogId + '-1', 1000)
    },
    (err) => {
      console.error('Async: Could not copy text: ', err)
      showDialogForLimitedTime(dialogId + '-2', 1000)
    }
  )
}

/**
   * Copy image of QR-Code contained in designated img tag
   * and displayed that the image has been copied in designated dialog widget
   * @param imageId id of the canvas
   * @param dialogId id of dialog widget where the info is displayed
   * @author sylvain
   */
export function copyQRCodeImageToClipboard (imageId, dialogId) {
  if (canCopyImagesToClipboard()) {
    const imageElement = document.getElementById(imageId)
    getBlobFromImageElement(imageElement)
      .then((blob) => {
        return copyBlobToClipboard(blob)
      })
      .then(() => {
        showDialogForLimitedTime(dialogId + '-1', 1000)
      })
      .catch((e) => {
        console.log('Error: ', e.message)
      })
  } else {
    showDialogForLimitedTime(dialogId + '-2', 2000)
  }
}

export async function copyEmbeddedCodeToClipboard (dialogId, urlAddendum = '', shorten = false, crypted = false) {
  let url
  if (shorten) {
    try {
      url = await getShortenedCurrentUrl(urlAddendum)
    } catch (error) {
      showDialogForLimitedTime(dialogId + '-2', 1000)
      throw error
    }
  } else {
    url = crypted ? encrypt(document.URL + urlAddendum) : document.URL + urlAddendum
  }
  const embeddedCode =
  `<iframe
      height="400" 
      src="${url}"
      frameborder="0" >
  </iframe>`
  navigator.clipboard.writeText(embeddedCode).then(
    () => {
      showDialogForLimitedTime(dialogId + '-1', 1000)
    },
    (err) => {
      console.error('Async: Could not copy text: ', err)
      showDialogForLimitedTime(dialogId + '-2', 1000)
    }
  )
}
