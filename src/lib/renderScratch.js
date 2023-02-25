import scratchblocks from 'scratchblocks'
import scratchFr from '../json/scratchFr.json'

export default function renderScratch (selector = '') {
  // Exécuter 2 fois le rendu sur un même élément <pre> semble buguer
  // Donc le sélectionneur css ne cible que l'exercice en cours
  // pour ne pas altérer les rendus des autres exercices
  if (selector !== '') selector = selector + ' '
  scratchblocks.loadLanguages({ fr: scratchFr })
  scratchblocks.renderMatching(`${selector}pre.blocks`, {
    style: 'scratch3',
    languages: ['fr'],
    scale: 0.7
  })
  // Le code est rendu dans un svg enfant de pre.blocks
  // Quand le render passe une 2e fois, il essaie de rendre le code svg d'où le bug
  // Donc une fois le code rendu, on enlève la classe blocks pour ne plus le sélectionner
  document.querySelectorAll(`${selector}pre.blocks`).forEach(el => el.classList.remove('blocks'))
  scratchblocks.renderMatching(`${selector}code.b`, {
    inline: true,
    style: 'scratch3',
    languages: ['fr'],
    scale: 0.7
  })
}
