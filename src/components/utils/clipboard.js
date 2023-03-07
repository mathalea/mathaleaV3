import { showDialogForLimitedTime } from './dialogs'
import { getBlobFromImageElement, copyBlobToClipboard, canCopyImagesToClipboard } from 'copy-image-clipboard'

/**
   * Copy current URL to clipboard
   * @param dialogId id of dialog widget where the info is displayed
   * @param urlAddendum string to be added at the end of the URL
   * @author sylvain
   */
export function copyLinkToClipboard (dialogId, urlAddendum = '') {
  const url = document.URL + urlAddendum
  navigator.clipboard.writeText(url).then(
    () => {
      showDialogForLimitedTime(dialogId, 1000)
    },
    (err) => {
      console.error('Async: Could not copy text: ', err)
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
