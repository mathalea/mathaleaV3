class Latex {
  content: string
  constructor () {
    this.content = ''
  }

  private writeTitle (title: string): string {
    return '\n\n' + this.format(title) + '\n'
  }

  private writeIntroduction (consigne: string, introduction = ''): string {
    let content = ''
    content += '\n' + this.format(consigne) + '\n'
    if (introduction.length > 0) {
      content += '\n' + this.format(introduction) + '\n'
    }
    return content
  }

  private writeQuestions (questions: string[]): string {
    let content = ''
    if (questions.length > 1) {
      content += '\n\\begin{enumerate}'
      for (const question of questions) {
        content += '\n\t\\item ' + this.format(question)
      }
      content += '\n\\end{enumerate}'
    } else {
      content += '\n' + this.format(questions[0])
    }
    return content
  }

  addExercice ({ title, id, consigne, introduction, questions } : { title: string, consigne: string, introduction: string, id: string, questions: string[]}) {
    this.content += `\n\\begin{Exo}{${title}}{${id.replace('.js', '')}}\n`
    this.content += this.writeIntroduction(consigne, introduction)
    this.content += this.writeQuestions(questions)
    this.content += '\n\\end{Exo}\n'
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
