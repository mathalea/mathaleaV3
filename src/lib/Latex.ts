import preambule from '../lib/latex/preambule.tex?raw'
import type TypeExercice from '../components/utils/typeExercice'

class Latex {
  content: string
  contentCorr: string
  constructor () {
    this.content = ''
    this.contentCorr = ''
  }

  private writeTitle (title: string): string {
    return '\n\n' + this.format(title) + '\n'
  }

  private writeIntroduction (introduction = ''): string {
    let content = ''
    if (introduction.length > 0) {
      content += '\n' + this.format(introduction)
    }
    return content
  }

  private writeQuestions (questions: string[], spacing = 1): string {
    let content = ''
    if (questions.length > 1) {
      content += '\n\\begin{enumerate}'
      if (spacing !== 1) {
        content += `[itemsep=${spacing}em]`
      }
      for (const question of questions) {
        content += '\n\t\\item ' + this.format(question)
      }
      content += '\n\\end{enumerate}'
    } else {
      content += '\n' + this.format(questions[0])
    }
    return content
  }

  private writeInCols (text, nb: number): string {
    if (nb < 2) return text
    return `\\begin{multicols}{${nb}}${text}\n\\end{multicols}`
  }

  addExercice (exercice: TypeExercice) {
    this.content += `\n\\begin{EXO}{${exercice.consigne}}{${exercice.id.replace('.js', '')}}\n`
    this.content += this.writeIntroduction(exercice.introduction)
    this.content += this.writeInCols(this.writeQuestions(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
    this.content += '\n\\end{EXO}\n'
    this.contentCorr += '\n\\begin{EXO}{}{}\n'
    this.contentCorr += this.writeIntroduction(exercice.consigneCorrection)
    this.contentCorr += this.writeInCols(this.writeQuestions(exercice.listeCorrections, exercice.spacingCorr), exercice.nbColsCorr)
    this.contentCorr += '\n\\end{EXO}\n'
  }

  getFile () {
    let result = '\\documentclass[a4paper,11pt,fleqn]{article}\n\n' + preambule + '\n\n\\Theme[Coopmaths]{nombres}{}{}{}\n\n\\begin{document}\n' + this.content
    result += '\n\n\\clearpage\n\n\\begin{Correction}' + this.contentCorr + '\n\\clearpage\n\\end{Correction}\n\\end{document}'
    return result
  }

  get text () {
    return this.content.replaceAll('\\\\\n', '\n')
  }

  /**
   * Pour les exercices Mathalea on a des conventions pour les sauts de ligne qui fonctionnent en HTML comme en LaTeX
   * * `<br>` est remplacé par un saut de paragraphe
   * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
   */
  private format (text: string) {
    return text.replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/gim, '\n\n\\medskip\n').replace(/<br>/g, '\\\\\n')
  }
}

export default Latex
