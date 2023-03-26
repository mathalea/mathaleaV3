import preambule from '../lib/latex/preambule.tex?raw'
import type TypeExercice from '../components/utils/typeExercice'
import { MathaleaHandleExerciceSimple } from './Mathalea.js'
import seedrandom from 'seedrandom'

class Latex {
  exercices: TypeExercice[]
  constructor () {
    this.exercices = []
  }

  addExercices (exercices: TypeExercice[]) {
    this.exercices.push(...exercices)
  }

  getContentsForAVersion (
    style: 'Coopmaths' | 'Classique' | 'Can',
    indiceVersion: number = 1
  ): { content: string; contentCorr: string } {
    let content = ''
    let contentCorr = ''
    for (const exercice of this.exercices) {
      if (exercice.typeExercice === 'statique') continue
      if (exercice.typeExercice === 'simple') MathaleaHandleExerciceSimple(exercice, false)
      const seed = indiceVersion > 1 ? exercice.seed + indiceVersion.toString() : exercice.seed
      seedrandom(seed, { global: true })
      exercice.nouvelleVersion()
    }
    if (style === 'Can') {
      content += '\\begin{TableauCan}\n'
      contentCorr += '\n\\begin{enumerate}'
      for (const exercice of this.exercices) {
        for (let i = 0; i < exercice.listeQuestions.length; i++) {
          if (exercice.listeCanEnonces[i] !== undefined && exercice.listeCanReponsesACompleter[i] !== undefined) {
            content += `\\thenbEx  \\addtocounter{nbEx}{1}& ${format(exercice.listeCanEnonces[i])} &  ${format(
              exercice.listeCanReponsesACompleter[i]
            )} &\\tabularnewline \\hline\n`
          } else {
            content += `\\thenbEx  \\addtocounter{nbEx}{1}& ${format(exercice.listeQuestions[i])} &&\\tabularnewline \\hline\n`
          }
        }
        for (const correction of exercice.listeCorrections) {
          contentCorr += `\n\\item ${format(correction)}`
        }
      }
      contentCorr += '\n\\end{enumerate}\n'
      content += '\\end{TableauCan}\n\\addtocounter{nbEx}{-1}'
      /** On supprime les lignes vides car elles posent problème dans l'environnement TableauCan */
      content = content.replace(/\n\s*\n/gm, '')
    } else {
      for (const exercice of this.exercices) {
        if (exercice.typeExercice === 'statique') {
          if (exercice.content === '') {
            content += '% Cet exercice n\'est pas disponible au format LaTeX'
          } else {
            if (style === 'Coopmaths') {
              content += `\n\\begin{EXO}{${exercice.examen || ''} ${exercice.mois || ''} ${exercice.annee || ''} ${exercice.lieu || ''}}{}\n`
            } else if (style === 'Classique') {
              content += '\n\\begin{EXO}{}{}\n'
            }
            content += exercice.content
            content += '\n\\end{EXO}\n'
            contentCorr += '\n\\begin{EXO}{}{}\n'
            contentCorr += exercice.contentCorr
            contentCorr += '\n\\end{EXO}\n'
          }
        } else {
          contentCorr += '\n\\begin{EXO}{}{}\n'
          contentCorr += '\n\\begin{enumerate}'
          for (const correction of exercice.listeCorrections) {
            contentCorr += `\n\\item ${format(correction)}`
          }
          contentCorr += '\n\\end{enumerate}\n'
          contentCorr += '\n\\end{EXO}\n'
          content += `\n\\begin{EXO}{${exercice.consigne}}{${exercice.id.replace('.js', '')}}\n`
          content += writeIntroduction(exercice.introduction)
          content += writeInCols(writeQuestions(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
          content += '\n\\end{EXO}\n'
        }
      }
    }
    return { content, contentCorr }
  }

  getContents (style: 'Coopmaths' | 'Classique' | 'Can', nbVersions: number = 1): { content: string; contentCorr: string } {
    const contents = { content: '', contentCorr: '' }
    for (let i = 1; i < nbVersions + 1; i++) {
      const contentVersion = this.getContentsForAVersion(style, i)
      if (i > 1) {
        contents.content += '\n\\clearpage'
        contents.content += '\n\\setcounter{ExoMA}{0}'
        contents.contentCorr += '\n\\clearpage'
        contents.contentCorr += '\n\\setcounter{ExoMA}{0}'
      }
      if (nbVersions > 1) {
        contents.content += `\n\\version{${i}}`
        contents.contentCorr += `\n\\version{${i}}`
        if (i > 1 && style === 'Can') {
          contents.content += '\n\\setcounter{nbEx}{1}'
          contents.content += '\n\\pageDeGardeCan{nbEx}\n\\clearpage'
        }
      }
      contents.content += contentVersion.content
      contents.contentCorr += contentVersion.contentCorr
    }
    return contents
  }

  getFile ({
    title,
    reference,
    subtitle,
    style,
    nbVersions
  }: {
    title: string
    reference: string
    subtitle: string
    style: 'Coopmaths' | 'Classique' | 'Can'
    nbVersions: number
  }) {
    const contents = this.getContents(style, nbVersions)
    const content = contents.content
    const contentCorr = contents.contentCorr
    let result = ''
    if (style === 'Can') {
      result += `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${preambule}\n\n`
      result += '\n\\Theme[CAN]{}{}{}{}'
      result += '\n\\begin{document}'
      result += '\n\\setcounter{nbEx}{1}'
      result += '\n\\pageDeGardeCan{nbEx}'
      result += '\n\\clearpage'
      result += content
    } else {
      result = `\\documentclass[a4paper,11pt,fleqn]{article}\n\n${preambule}\n\n\\Theme[${style}]{nombres}{${title}}{${reference}}{${subtitle}}\n\n\\begin{document}\n${content}`
    }
    result += '\n\n\\clearpage\n\n\\begin{Correction}' + contentCorr + '\n\\clearpage\n\\end{Correction}\n\\end{document}'
    result += '\n\n% Local Variables:\n% TeX-engine: luatex\n% End:'
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
  if (questions !== undefined && questions.length > 1) {
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

function writeInCols (text: string, nb: number): string {
  if (nb < 2) return text
  return `\\begin{multicols}{${nb}}${text}\n\\end{multicols}`
}

/**
 * Pour les exercices Mathalea on a des conventions pour les sauts de ligne qui fonctionnent en HTML comme en LaTeX
 * * `<br>` est remplacé par un saut de paragraphe
 * * `<br><br>` est remplacé par un saut de paragraphe et un medskip
 */
export function format (text: string): string {
  if (text === undefined) return ''
  return text
    .replace(/(<br *\/?>[\n\t ]*)+<br *\/?>/gim, '\n\n\\medskip\n')
    .replace(/<br>/g, '\\\\')
    .replace(/\\\\\s*\n\n/gm, '\\\\')
}

export default Latex
