import preambule from '../lib/latex/preambule.tex?raw'
import type TypeExercice from '../components/utils/typeExercice'
import Mathalea from './Mathalea.js'
import seedrandom from 'seedrandom'

class Latex {
  exercices: TypeExercice[]
  constructor () {
    this.exercices = []
  }

  addExercices (exercices: TypeExercice[]) {
    this.exercices.push(...exercices)
  }

  getContents (style: 'coopmaths' | 'classique' | 'can', nbOfVersions: number = 1): { content: string, contentCorr: string } {
    let content = ''
    let contentCorr = ''
    for (const exercice of this.exercices) {
      if (exercice.typeExercice === 'simple') Mathalea.handleExerciceSimple(exercice, false)
      seedrandom(exercice.seed, { global: true })
      exercice.nouvelleVersion()
    }
    if (style === 'can') {
      content = '\\TableauCan{\n'
      for (const exercice of this.exercices) {
        if (exercice.typeExercice === 'simple') {
          for (let i = 0; i < exercice.listeQuestions.length; i++) {
            content += `\\thenbEx  \\addtocounter{nbEx}{1}& ${format(exercice.listeCanEnonces[i])} &&\\tabularnewline ${format(exercice.listeCanReponsesACompleter)} \\hline\n`
          }
        } else {
          for (let i = 0; i < exercice.listeQuestions.length; i++) {
            content += `\\thenbEx  \\addtocounter{nbEx}{1}& ${format(exercice.listeQuestions[i])} &&\\tabularnewline \\hline\n`
          }
        }
        content += '}\n\\addtocounter{nbEx}{-1}'
      }
    } else {
      for (const exercice of this.exercices) {
        content += `\n\\begin{EXO}{${exercice.consigne}}{${exercice.id.replace('.js', '')}}\n`
        content += writeIntroduction(exercice.introduction)
        content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
        content += '\n\\end{EXO}\n'
      }
    }
    for (const exercice of this.exercices) {
      contentCorr += '\n\\begin{EXO}{}{}\n'
      contentCorr += writeIntroduction(exercice.consigneCorrection)
      contentCorr += writeInCols(writeQuestions(exercice.listeCorrections, exercice.spacingCorr), exercice.nbColsCorr)
      contentCorr += '\n\\end{EXO}\n'
    }
    return { content, contentCorr }
  }

  getFile ({ title, reference, subtitle, style }: { title: string, reference: string, subtitle: string, style: 'coopmaths' | 'classique' | 'can' }) {
    const contents = this.getContents(style)
    const content = contents.content
    const contentCorr = contents.contentCorr
    let result = ''
    if (style === 'can') {
      result += `\\documentclass[a4paper,11pt,fleqn]{article}\n\n' ${preambule} \n\n \\thispagestyle{premierePage}`
      result += '\n\\begin{document}'
      result += '\n\\setcounter{nbEx}{1}'
      result += '\\pageDeGardeCan{nbEx}'
      result += '\n\\clearpage'
      result += content
    } else {
      result = '\\documentclass[a4paper,11pt,fleqn]{article}\n\n' + preambule + `\n\n\\Theme[${style}]{nombres}{${title}}{${reference}}{${subtitle}}\n\n\\begin{document}\n` + content
    }
    result += '\n\n\\clearpage\n\n\\begin{Correction}' + contentCorr + '\n\\clearpage\n\\end{Correction}\n\\end{document}'
    return result
  }
}

function writeIntroduction (introduction = ''): string {
  let content = ''
  if (introduction.length > 0) {
    content += '\n' + format(introduction)
  }
  return content
}

function writeQuestions (questions: string[], spacing = 1): string {
  let content = ''
  if (questions.length > 1) {
    content += '\n\\begin{enumerate}'
    if (spacing !== 1) {
      content += `[itemsep=${spacing}em]`
    }
    for (const question of questions) {
      content += '\n\t\\item ' + format(question)
    }
    content += '\n\\end{enumerate}'
  } else {
    content += '\n' + format(questions[0])
  }
  return content
}

function writeInCols (text, nb: number): string {
  if (nb < 2) return text
  return `\\begin{multicols}{${nb}}${text}\n\\end{multicols}`
}

/**
   * Pour les exercices Mathalea on a des conventions pour les sauts de ligne qui fonctionnent en HTML comme en LaTeX
   * * `<br>` est remplacé par un saut de paragraphe
   * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
   */
function format (text: string) {
  return text.replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/gim, '\n\n\\medskip\n').replace(/<br>/g, '\\\\\n')
}

export default Latex
