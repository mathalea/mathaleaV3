import preambule from '../lib/latex/preambule.tex?raw'
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
      content += '\n' + this.format(introduction) + '\n'
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

  addExercice ({ title, id, consigne, introduction, questions, spacing = 1, corrections, spacingCorr = 1, introductionCorr = '' } : { title: string, consigne: string, introduction: string, id: string, questions: string[], spacing: number, corrections: string[], spacingCorr: number, introductionCorr: string}) {
    this.content += `\n\\begin{EXO}{${consigne}}{${id.replace('.js', '')}}\n`
    this.content += this.writeIntroduction(introduction)
    this.content += this.writeQuestions(questions, spacing)
    this.content += '\n\\end{EXO}\n'
    this.contentCorr += `\n\\begin{EXO}{${consigne}}{${id.replace('.js', '')}}\n`
    this.contentCorr += this.writeIntroduction(introductionCorr)
    this.contentCorr += this.writeQuestions(corrections, spacingCorr)
    this.contentCorr += '\n\\end{EXO}\n'
  }

  getFile () {
    let result = '\\documentclass[a4paper,11pt,fleqn]{article}\n\n' + preambule + '\n\n\\Theme[Coopmaths]{nombres}{}{}{}\n\n\\begin{document}\n' + this.content
    result += '\n\n\\clearpage\n\n\\begin{Correction}' + this.contentCorr + '\n\\clearpage\n\\end{Correction}\n\\end{document}'
    return result
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
