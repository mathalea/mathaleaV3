import { randint, arrondi, calcul, texNombrec, nombreAvecEspace, choice } from '../../modules/outils.js'

/**
 * Chosis aléatoirement une expressions numérique parmi de nombreuses variantes.
 * @param {number} nbOperations fixe la complexité de l'expression à retourner
 * @param {number} decimal 1 si on veut des entiers, 10, 100, 1000 selon le nombre de chiffres après la virgule qu'on veut
 * retourne
 * * l'expression en français commençant par une majuscule sans point final
 * * l'expression en mode maths LaTex
 * * Le détaillé du calcul en mode maths LaTex
 * * la réponse numérique du calcul (Ajout par EE)
 * @author Jean-Claude Lhote
 * Fonction utilisée dans plusieurs exercices.
 */
export default function ChoisirExpressionNumerique (nbOperations, decimal, timesOn = true, calculMental) {
  let expf; let expn; let expc; let repNum; const arrondir = Math.log10(decimal)
  let a = arrondi(randint(2 * decimal, 10 * decimal) / decimal, arrondir)
  let b = arrondi(randint(2 * decimal, 10 * decimal, [a * decimal]) / decimal, arrondir)
  let c = arrondi(randint(2 * decimal, 10 * decimal) / decimal, arrondir)
  let d = arrondi(randint(2 * decimal, 10 * decimal, [c * decimal]) / decimal, arrondir)
  let e = arrondi(randint(2 * decimal, 10 * decimal) / decimal, arrondir)
  let souscas
  let signex = ''
  if (timesOn) { signex = ' \\times' }
  switch (nbOperations) {
    case 1: // expressions de base (1 opération)
      souscas = randint(0, 3)
      switch (souscas) {
        case 0: // somme de deux nombres
          repNum = arrondi(a + b)
          expf = `La somme de ${nombreAvecEspace(a)} et de ${nombreAvecEspace(b)}`
          expn = `$${texNombrec(a)}+${texNombrec(b)}$`
          expc = `$${texNombrec(a)}+${texNombrec(b)} = ${texNombrec(a + b)}$`
          break
        case 1: // différence entre deux nombres
          if (a < b) { [a, b] = [b, a] } // pour ne pas avoir de nombres négatifs
          repNum = arrondi(a - b)
          expf = `La différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)}`
          expn = `$${texNombrec(a)}-${texNombrec(b)}$`
          expc = `$${texNombrec(a)}-${texNombrec(b)} = ${texNombrec(a - b)}$`
          break
        case 2: // produit de deux nombres
          repNum = arrondi(a * b)
          expf = `Le produit de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)}`
          expn = `$${texNombrec(a)} \\times ${texNombrec(b)}$`
          expc = `$${texNombrec(a)} \\times ${texNombrec(b)} = ${texNombrec(a * b)}$`
          break
        case 3: // quotient de deux nombres
          a = calcul(Math.round(a) * b)
          repNum = arrondi(a / b)
          expf = `Le quotient de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)}`
          expn = `$${texNombrec(a)} \\div ${texNombrec(b)}$`
          expc = `$${texNombrec(a)} \\div ${texNombrec(b)} = ${texNombrec(a / b)}$`
          break
      }
      break
    case 2: // expressions de niveau 1 (2 opérations)
      souscas = randint(0, 9)
      switch (souscas) {
        case 0: // a(b+c)
          if (calculMental) {
            a = choice([2, 3, 4])
            b = randint(1, 5)
            c = choice([7, 8, 9, 10, 11, 12, 15, 20, 25, 50]) - b
          }
          expf = `Le produit de ${nombreAvecEspace(a)} par la somme de ${nombreAvecEspace(b)} et ${nombreAvecEspace(c)}`
          expn = `$${texNombrec(a)}${signex}(${texNombrec(b)}+${texNombrec(c)})$`
          expc = `$${texNombrec(a)}${signex}(${texNombrec(b)}+${texNombrec(c)}) = ${texNombrec(a)} \\times ${texNombrec(b + c)}=${texNombrec(a * (b + c))}$`
          repNum = arrondi(a * (b + c))
          break
        case 1: // a(b-c)
          if (b <= c) { b = calcul(b + c) } // b-c positif
          if (calculMental) {
            a = choice([2, 3, 4])
            c = randint(1, 5)
            b = choice([7, 8, 9, 10, 11, 12, 15, 20, 25, 50]) + c
          }
          expf = `Le produit de ${nombreAvecEspace(a)} par la différence entre ${nombreAvecEspace(b)} et ${nombreAvecEspace(c)}`
          expn = `$${texNombrec(a)}${signex}(${texNombrec(b)}-${texNombrec(c)})$`
          expc = `$${texNombrec(a)}${signex}(${texNombrec(b)}-${texNombrec(c)}) = ${texNombrec(a)} \\times ${texNombrec(b - c)}=${texNombrec(a * (b - c))}$`
          repNum = arrondi(a * (b - c))
          break
        case 2: // a/(b+c)
          a = calcul(a * (b + c)) // on s'assure que le quotient tombe juste...
          if (calculMental) {
            b = randint(1, 5)
            c = choice([7, 8, 9, 10, 11, 12, 15, 20, 25, 50]) - b
            a = choice([2, 3, 4, 5]) * (c + b)
          }
          expf = `Le quotient de ${nombreAvecEspace(a)} par la somme de ${nombreAvecEspace(b)} et ${nombreAvecEspace(c)}`
          expn = `$${texNombrec(a)} \\div (${texNombrec(b)}+${texNombrec(c)})$ ou $\\dfrac{${texNombrec(a)}}{${texNombrec(b)}+${texNombrec(c)}}$`
          expc = `$${texNombrec(a)} \\div (${texNombrec(b)}+${texNombrec(c)}) = ${texNombrec(a)} \\div ${texNombrec(b + c)}=${texNombrec(a / (b + c))}$`
          repNum = arrondi(a / (b + c))
          break
        case 3: // a/(b-c)
          if (b <= c) { b = calcul(b + c) } // b-c positif
          a = calcul(a * (b - c)) // on s'assure que le quotient tombe juste
          if (calculMental) {
            c = randint(1, 5)
            b = choice([7, 8, 9, 10, 11, 12, 15, 20, 25, 50]) + c
            a = choice([2, 3, 4, 5]) * (b - c)
          }
          expf = `Le quotient de ${nombreAvecEspace(a)} par la différence entre ${nombreAvecEspace(b)} et ${nombreAvecEspace(c)}`
          expn = `$${texNombrec(a)} \\div (${texNombrec(b)}-${texNombrec(c)})$ ou $\\dfrac{${texNombrec(a)}}{${texNombrec(b)}-${texNombrec(c)}}$`
          expc = `$${texNombrec(a)} \\div (${texNombrec(b)}-${texNombrec(c)}) = ${texNombrec(a)} \\div ${texNombrec(b - c)}=${texNombrec(a / (b - c))}$`
          repNum = arrondi(a / (b - c))
          break
        case 4: // (a+b)/c
          a = calcul(a * c)
          b = calcul(b * c) // on s'assure que le quotient tombe juste
          if (calculMental) {
            c = choice([2, 3, 4, 5])
            a = randint(1, 5) * c
            b = choice([7, 8, 9, 10, 11, 12, 15, 20, 25, 50]) * c - a
          }
          expf = `Le quotient de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par ${nombreAvecEspace(c)}`
          expn = `$(${texNombrec(a)}+${texNombrec(b)}) \\div ${texNombrec(c)}$ ou $\\dfrac{${texNombrec(a)}+${texNombrec(b)}}{${texNombrec(c)}}$`
          expc = `$(${texNombrec(a)}+${texNombrec(b)}) \\div ${texNombrec(c)} = ${texNombrec(a + b)} \\div ${texNombrec(c)}=${texNombrec((a + b) / c)}$`
          repNum = arrondi((a + b) / c)
          break
        case 5: // (a-b)/c
          if (a <= b) { a = calcul(a + b) } // a-b positif
          a = calcul(a * c)
          b = calcul(b * c) // on s'assure que le quotient tombe juste
          if (calculMental) {
            c = choice([2, 3, 4, 5])
            b = randint(1, 5) * c
            a = choice([7, 8, 9, 10, 11, 12, 15, 20, 25, 50]) * c + b
          }
          expf = `Le quotient de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par ${nombreAvecEspace(c)}`
          expn = `$(${texNombrec(a)}-${texNombrec(b)}) \\div ${texNombrec(c)}$ ou $\\dfrac{${texNombrec(a)}-${texNombrec(b)}}{${texNombrec(c)}}$`
          expc = `$(${texNombrec(a)}-${texNombrec(b)}) \\div ${texNombrec(c)} = ${texNombrec(a - b)} \\div ${texNombrec(c)}=${texNombrec((a - b) / c)}$`
          repNum = arrondi((a - b) / c)
          break
        case 6: // a + bc
          if (calculMental) {
            c = choice([2, 3, 4, 5])
            b = randint(2, 9)
            a = randint(2, 9)
          }
          expf = `La somme de ${nombreAvecEspace(a)} et du produit de ${nombreAvecEspace(b)} et $${nombreAvecEspace(c)}$`
          expn = `$${texNombrec(a)}+${texNombrec(b)} \\times ${texNombrec(c)}$`
          expc = `$${texNombrec(a)}+${texNombrec(b)} \\times ${texNombrec(c)}=${texNombrec(a)}+${texNombrec(b * c)} = ${texNombrec(a + (b * c))}$`
          repNum = arrondi(a + b * c)
          break
        case 7: // a - bc
          a = calcul(a + b * c)
          if (calculMental) {
            c = choice([2, 3, 4, 5])
            b = randint(2, 9)
            a = randint(2, 9) + b * c
          }
          expf = `La différence entre ${nombreAvecEspace(a)} et le produit de ${nombreAvecEspace(b)} et $${nombreAvecEspace(c)}$`
          expn = `$${texNombrec(a)}-${texNombrec(b)} \\times ${texNombrec(c)}$`
          expc = `$${texNombrec(a)}-${texNombrec(b)} \\times ${texNombrec(c)}=${texNombrec(a)}-${texNombrec(b * c)} = ${texNombrec(a - (b * c))}$`
          repNum = arrondi(a - b * c)
          break
        case 8: // a + b/c
          b = calcul(b * c)
          if (calculMental) {
            c = choice([2, 3, 4, 5])
            b = randint(2, 6) * c
            a = randint(2, 9)
          }
          expf = `La somme de ${nombreAvecEspace(a)} et du quotient de ${nombreAvecEspace(b)} par $${nombreAvecEspace(c)}$`
          expn = `$${texNombrec(a)}+${texNombrec(b)} \\div ${texNombrec(c)}$ ou $${texNombrec(a)}+\\dfrac{${texNombrec(b)}}{${texNombrec(c)}}$`
          expc = `$${texNombrec(a)}+${texNombrec(b)} \\div ${texNombrec(c)}=${texNombrec(a)}+${texNombrec(b / c)} = ${texNombrec(a + (b / c))}$`
          repNum = arrondi(a + b / c)
          break
        case 9: // a - b/c
          a = calcul(a + b)
          b = calcul(b * c)
          if (calculMental) {
            c = choice([2, 3, 4, 5])
            b = randint(2, 6) * c
            a = randint(2, 9) + b * c
          }
          expf = `La différence entre ${nombreAvecEspace(a)} et le quotient de ${nombreAvecEspace(b)} par $${nombreAvecEspace(c)}$`
          expn = `$${texNombrec(a)}-${texNombrec(b)} \\div ${texNombrec(c)}$ ou $${texNombrec(a)}-\\dfrac{${texNombrec(b)}}{${texNombrec(c)}}$`
          expc = `$${texNombrec(a)}-${texNombrec(b)} \\div ${texNombrec(c)}=${texNombrec(a)}-${texNombrec(b / c)} = ${texNombrec(a - (b / c))}$`
          repNum = arrondi(a - b / c)
          break
      }
      break
    case 3: // expressions de niveau 2 (3 opérations)
      souscas = randint(0, 13)
      switch (souscas) {
        case 0: // (a+b)(c+d)
          if (calculMental) { // Objectif : 4 entiers différents entre 1 et 10. Un des facteurs peut atteindre 11, pas l'autre.
            a = randint(1, 10)
            b = randint(1, 11 - a, [a])
            c = randint(1, 6, [a, b]) // 6 ici, car d doit pouvoir, à toutes occasions, choisir entre 4 nb minimum.
            d = randint(1, 10 - c, [a, b, c])
          }
          expf = `Le produit de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la somme de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}+${texNombrec(b)})${signex}(${texNombrec(c)}+${texNombrec(d)})$`
          expc = `$(${texNombrec(a)}+${texNombrec(b)})${signex}(${texNombrec(c)}+${texNombrec(d)}) = ${texNombrec(a + b)} \\times ${texNombrec(c + d)} = ${texNombrec((a + b) * (c + d))}$`
          repNum = arrondi((a + b) * (c + d))
          break
        case 1: // (a+b)(c-d)
          if (calculMental) { // Objectif : La différence est supérieure à 1.
            a = randint(1, 10)
            b = randint(1, 11 - a, [a])
            d = randint(1, 6, [a, b])
            c = randint(2, 10 - d, [a - d, b - d]) + d
          } else {
            if (c <= d) { c = calcul(c + d) }
          }
          expf = `Le produit de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la différence entre ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}+${texNombrec(b)})${signex}(${texNombrec(c)}-${texNombrec(d)})$`
          expc = `$(${texNombrec(a)}+${texNombrec(b)})${signex}(${texNombrec(c)}-${texNombrec(d)}) = ${texNombrec(a + b)} \\times ${texNombrec(c - d)} = ${texNombrec((a + b) * (c - d))}$`
          repNum = arrondi((a + b) * (c - d))
          break
        case 2: // (a-b)(c+d)
          if (calculMental) {
            b = randint(1, 9)
            a = randint(2, 10 - b) + b
            c = randint(1, 6, [a, b])
            d = randint(1, 10 - c, [a, b, c])
          } else {
            if (a <= b) { a = calcul(a + b) }
          }
          expf = `Le produit de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la somme de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}-${texNombrec(b)})${signex}(${texNombrec(c)}+${texNombrec(d)})$`
          expc = `$(${texNombrec(a)}-${texNombrec(b)})${signex}(${texNombrec(c)}+${texNombrec(d)}) = ${texNombrec(a - b)} \\times ${texNombrec(c + d)} = ${texNombrec((a - b) * (c + d))}$`
          repNum = arrondi((a - b) * (c + d))
          break
        case 3: // (a-b)(c-d)
          if (calculMental) {
            b = randint(1, 9)
            a = randint(2, 10 - b) + b
            d = randint(1, 6, [a, b])
            c = randint(2, 10 - d, [a - d, b - d]) + d
          } else {
            if (a <= b) { a = calcul(a + b) }
            if (c <= d) { c = calcul(c + d) }
          }
          expf = `Le produit de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la différence entre ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}-${texNombrec(b)})${signex}(${texNombrec(c)}-${texNombrec(d)})$`
          expc = `$(${texNombrec(a)}-${texNombrec(b)})${signex}(${texNombrec(c)}-${texNombrec(d)}) = ${texNombrec(a - b)} \\times ${texNombrec(c - d)} = ${texNombrec((a - b) * (c - d))}$`
          repNum = arrondi((a - b) * (c - d))
          break
        case 4: // (a+b)/(c+d)
          if (calculMental) { // Objectif : Le numérateur est un multiple du dénominateur (plus petit que 12), entre 2 et 5 fois plus.
            c = randint(1, 10)
            d = randint(1, 11 - c, [c])
            a = randint(1, calcul(2 * (c + d) - 1), [c, d, calcul(c + d)]) // a est un nb petit entre 1 et le double du dénominateur pour faciliter les calculs.
            if (randint(1, 2) === 1) { // Pour ne pas que a soit toujours le nombre le plus petit entre a et b.
              b = calcul(randint(2, 5) * (c + d) - a)
            } else {
              b = a
              a = calcul(randint(2, 5) * (c + d) - a)
            }
          } else {
            a = calcul(a * (c + d))
            b = calcul(b * (c + d))
          }
          expf = `Le quotient de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la somme de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}+${texNombrec(b)}) \\div (${texNombrec(c)}+${texNombrec(d)})$ ou $\\dfrac{${texNombrec(a)}+${texNombrec(b)}}{${texNombrec(c)}+${texNombrec(d)}}$`
          expc = `$(${texNombrec(a)}+${texNombrec(b)}) \\div (${texNombrec(c)}+${texNombrec(d)}) = ${texNombrec(a + b)} \\div ${texNombrec(c + d)} = ${texNombrec((a + b) / (c + d))}$`
          repNum = arrondi((a + b) / (c + d))
          break
        case 5: // (a-b)/(c+d)
          if (calculMental) {
            c = randint(1, 10)
            d = randint(1, 11 - c, [c])
            b = randint(1, 11, [c, d])
            a = calcul(randint(2, 5) * (c + d) + b)
          } else {
            a = calcul(a * (c + d))
            b = calcul(b * (c + d))
            if (a <= b) { a = calcul(a + b) }
          }
          expf = `Le quotient de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la somme de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}-${texNombrec(b)}) \\div (${texNombrec(c)}+${texNombrec(d)})$ ou $\\dfrac{${texNombrec(a)}-${texNombrec(b)}}{${texNombrec(c)}+${texNombrec(d)}}$`
          expc = `$(${texNombrec(a)}-${texNombrec(b)}) \\div (${texNombrec(c)}+${texNombrec(d)}) = ${texNombrec(a - b)} \\div ${texNombrec(c + d)} = ${texNombrec((a - b) / (c + d))}$`
          repNum = arrondi((a - b) / (c + d))
          break
        case 6: // (a+b)/(c-d)
          if (calculMental) {
            d = randint(1, 9)
            c = randint(2, 12 - d) + d
            a = randint(1, calcul(2 * (c - d) - 1), [c, d])
            if (randint(1, 2) === 1) {
              b = calcul(randint(2, 5) * (c - d) - a)
            } else {
              b = a
              a = calcul(randint(2, 5) * (c - d) - a)
            }
          } else {
            if (c <= d) { c = calcul(c + d) }
            a = calcul(a * (c - d))
            b = calcul(b * (c - d))
          }
          expf = `Le quotient de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la différence entre ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}+${texNombrec(b)}) \\div (${texNombrec(c)}-${texNombrec(d)})$ ou $\\dfrac{${texNombrec(a)}+${texNombrec(b)}}{${texNombrec(c)}-${texNombrec(d)}}$`
          expc = `$(${texNombrec(a)}+${texNombrec(b)}) \\div (${texNombrec(c)}-${texNombrec(d)}) = ${texNombrec(a + b)} \\div ${texNombrec(c - d)} = ${texNombrec((a + b) / (c - d))}$`
          repNum = arrondi((a + b) / (c - d))
          break
        case 7: // (a-b)/(c-d)
          if (calculMental) {
            d = randint(1, 9)
            c = randint(2, 12 - d) + d
            b = randint(1, 11, [c, d])
            a = randint(2, 5) * (c - d) + b
          } else {
            if (c <= d) { c = calcul(c + d) }
            if (a <= b) { a = calcul(a + b) }
            a = calcul(a * (c - d))
            b = calcul(b * (c - d))
          }
          expf = `Le quotient de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la différence entre ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$(${texNombrec(a)}-${texNombrec(b)}) \\div (${texNombrec(c)}-${texNombrec(d)})$ ou $\\dfrac{${texNombrec(a)}-${texNombrec(b)}}{${texNombrec(c)}-${texNombrec(d)}}$`
          expc = `$(${texNombrec(a)}-${texNombrec(b)}) \\div (${texNombrec(c)}-${texNombrec(d)}) = ${texNombrec(a - b)} \\div ${texNombrec(c - d)} = ${texNombrec((a - b) / (c - d))}$`
          repNum = arrondi((a - b) / (c - d))
          break
        case 8: // ab+cd
          if (calculMental) { // Tous les nombres sont différents et choisis entre 1 et 5. On évalue les priorités avec des calculs faciles.
            a = randint(1, 5)
            b = randint(1, 5, [a])
            c = randint(1, 5, [a, b])
            d = randint(1, 5, [a, b, c])
          }
          expf = `La somme du produit de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)} et du produit de ${nombreAvecEspace(c)} par ${nombreAvecEspace(d)}`
          expn = `$${texNombrec(a)} \\times ${texNombrec(b)}+${texNombrec(c)} \\times ${texNombrec(d)}$`
          expc = `$${texNombrec(a)} \\times ${texNombrec(b)}+${texNombrec(c)} \\times ${texNombrec(d)} = ${texNombrec(a * b)}+${texNombrec(c * d)} = ${texNombrec(a * b + c * d)}$`
          repNum = arrondi(a * b + c * d)
          break
        case 9: // ab-cd
          if (calculMental) { // a,d et c sont différents et choisis entre 1 et 5.
            c = randint(1, 5)
            d = randint(1, 5, [c])
            a = randint(1, 5, [c, d])
            b = Math.floor(c * d / a) + randint(1, 2) // On s'arrange avec b pour que la différence ne soit pas difficile.
          } else {
            if (a * b < d * c) { a = calcul(a + c) }
            if (a * b < d * c) { b = calcul(b + d) }
          }
          expf = `La différence entre le produit de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} et le produit de ${nombreAvecEspace(c)} par ${nombreAvecEspace(d)}`
          expn = `$${texNombrec(a)} \\times ${texNombrec(b)}-${texNombrec(c)} \\times ${texNombrec(d)}$`
          expc = `$${texNombrec(a)} \\times ${texNombrec(b)}-${texNombrec(c)} \\times ${texNombrec(d)} = ${texNombrec(a * b)}-${texNombrec(c * d)} = ${texNombrec(a * b - c * d)}$`
          repNum = arrondi(a * b - c * d)
          break
        case 10: // ab+c/d
          if (calculMental) { // a, b, d sont différents et d est plus grand que 1.
            a = randint(1, 5)
            b = randint(1, 5, [a])
            d = randint(2, 5, [a, b])
            c = randint(2, 5) * d
          } else {
            c = calcul(c * d)
          }
          expf = `La somme du produit de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)} et du quotient de ${nombreAvecEspace(c)} par ${nombreAvecEspace(d)}`
          expn = `$${texNombrec(a)} \\times ${texNombrec(b)}+${texNombrec(c)} \\div ${texNombrec(d)}$ ou $${texNombrec(a)} \\times ${texNombrec(b)}+\\dfrac{${texNombrec(c)}}{${texNombrec(d)}}$`
          expc = `$${texNombrec(a)} \\times ${texNombrec(b)}+${texNombrec(c)} \\div ${texNombrec(d)} = ${texNombrec(a * b)}+${texNombrec(c / d)} = ${texNombrec(a * b + c / d)}$`
          repNum = arrondi(a * b + c / d)
          break
        case 11: // ab-c/d
          if (calculMental) { // b et d sont différents et plus grands que 1.
            d = randint(2, 5)
            c = randint(2, 5) * d
            a = randint(2, 5, [c, d])
            b = Math.floor((c / d) / a) + randint(1, 4) //  On s'arrange toujours avec b pour que la différence ne soit pas difficile.
          } else {
            c = c * d
            if (a * b < c / d) { a = calcul(a * c) }
            if (a * b < c / d) { b = calcul(b * c) }
          }
          expf = `La différence entre le produit de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)} et le quotient de ${nombreAvecEspace(c)} par ${nombreAvecEspace(d)}`
          expn = `$${texNombrec(a)} \\times ${texNombrec(b)}-${texNombrec(c)} \\div ${texNombrec(d)}$ ou $${texNombrec(a)} \\times ${texNombrec(b)}-\\dfrac{${texNombrec(c)}}{${texNombrec(d)}}$`
          expc = `$${texNombrec(a)} \\times ${texNombrec(b)}-${texNombrec(c)} \\div ${texNombrec(d)} = ${texNombrec(a * b)}-${texNombrec(c / d)} = ${texNombrec(a * b - c / d)}$`
          repNum = arrondi(a * b - c / d)
          break
        case 12: // a/b+c/d
          if (calculMental) { // b et d sont différents et plus grands que 1.
            b = randint(2, 5)
            a = randint(2, 5) * b
            d = randint(2, 5, [a, b])
            c = randint(2, 5) * d
          } else {
            a = calcul(a * b)
            c = calcul(c * d)
          }
          expf = `La somme du quotient de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)} et du quotient de ${nombreAvecEspace(c)} par ${nombreAvecEspace(d)}`
          expn = `$${texNombrec(a)} \\div ${texNombrec(b)}+${texNombrec(c)} \\div ${texNombrec(d)}$ ou $\\dfrac{${texNombrec(a)}}{${texNombrec(b)}}+\\dfrac{${texNombrec(c)}}{${texNombrec(d)}}$`
          expc = `$${texNombrec(a)} \\div ${texNombrec(b)}+${texNombrec(c)} \\div ${texNombrec(d)} = ${texNombrec(a / b)}+${texNombrec(c / d)} = ${texNombrec(a / b + c / d)}$`
          repNum = arrondi(a / b + c / d)
          break
        case 13: // a/b-c/d
          if (calculMental) { // b et d sont différents et plus grands que 1.
            d = randint(2, 5)
            c = randint(2, 5) * d
            b = randint(2, 5, [c, d])
            a = (Math.floor(c / d) + randint(1, 5)) * b // a multiple de b mais au maximum de 10 fois.
          } else {
            a = calcul(a * b)
            c = calcul(c * d)
            if (a / b < c / d) { a = calcul(a * c) }
            if (a / c < c / d) { a = calcul(a * d) }
          }
          expf = `La différence entre le quotient de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)} et le quotient de ${nombreAvecEspace(c)} par ${nombreAvecEspace(d)}`
          expn = `$${texNombrec(a)} \\div ${texNombrec(b)}-${texNombrec(c)} \\div ${texNombrec(d)}$ ou $\\dfrac{${texNombrec(a)}}{${texNombrec(b)}}-\\dfrac{${texNombrec(c)}}{${texNombrec(d)}}$`
          expc = `$${texNombrec(a)} \\div ${texNombrec(b)}-${texNombrec(c)} \\div ${texNombrec(d)} = ${texNombrec(a / b)}-${texNombrec(c / d)} = ${texNombrec(a / b - c / d)}$`
          repNum = arrondi(a / b - c / d)
          break
      }
      break
    case 5: // expressions complexes ! Ah qui, le dis-tu ! ;-)
      souscas = randint(0, 5)
      switch (souscas) {
        case 0: // 2(a+bc)
          if (calculMental) {
            a = randint(1, 10)
            b = randint(2, 5, [a])
            c = randint(2, 5, [a, b])
          }
          expf = `Le double de la somme de ${nombreAvecEspace(a)} et du produit de ${nombreAvecEspace(b)} par ${nombreAvecEspace(c)}`
          expn = `$2${signex}(${texNombrec(a)}+${texNombrec(b)} \\times ${texNombrec(c)})$`
          expc = `$2${signex}(${texNombrec(a)}+${texNombrec(b)} \\times ${texNombrec(c)}) = 2${signex}(${texNombrec(a)}+${texNombrec(b * c)}) = 2 \\times  ${texNombrec(a + b * c)} = ${texNombrec(2 * (a + b * c))}$`
          repNum = arrondi(2 * (a + b * c))
          break
        case 1: // 3(a+b)/c
          if (calculMental) { // b et d sont différents et plus grands que 1.
            c = randint(2, 10, [3, 6, 9]) // Pour ne pas que le 3 se simplfie avec c.
            a = randint(1, 2 * c - 1, [c])
            if (randint(1, 2) === 1) { b = randint(2, 5) * c - a } else { // Pour ne pas que a soit toujours le plus petit.
              b = a
              a = randint(2, 5) * c - b
            }
          } else {
            a = calcul(a * c)
            b = calcul(b * c)
          }
          expf = `Le triple du quotient de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par ${nombreAvecEspace(c)}`
          expn = `$3${signex}(${texNombrec(a)}+${texNombrec(b)}) \\div ${texNombrec(c)}$ ou $3 \\times \\dfrac{${texNombrec(a)}+${texNombrec(b)}}{${texNombrec(c)}}$`
          expc = `$3${signex}(${texNombrec(a)}+${texNombrec(b)}) \\div ${texNombrec(c)} = 3 \\times  ${texNombrec(a + b)} \\div ${texNombrec(c)} = ${texNombrec(3 * (a + b))} \\div ${texNombrec(c)} = ${texNombrec(3 * (a + b) / c)}$`
          repNum = arrondi(3 * (a + b) / c)
          break
        case 2: // (a-b)/3
          if (calculMental) {
            b = randint(2, 10)
            a = randint(2, 5) * 3 + b
          } else {
            if (a <= b) { a = calcul(a + b) }
            a = calcul(3 * a)
            b = calcul(3 * b)
          }
          expf = `Le tiers de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)}`
          expn = `$(${texNombrec(a)}-${texNombrec(b)}) \\div  3$ ou $\\dfrac{${texNombrec(a)}-${texNombrec(b)}}{3}$`
          expc = `$(${texNombrec(a)}-${texNombrec(b)}) \\div  3 = ${texNombrec(a - b)} \\div  3 = ${texNombrec((a - b) / 3)}$`
          repNum = arrondi((a - b) / 3)
          break
        case 3: // (a-b)/3*2(c+d)
          if (calculMental) {
            b = randint(2, 10)
            a = randint(2, 5) * 3 + b
            c = randint(1, 5)
            d = randint(1, 5, [c, b, a])
          } else {
            if (a <= b) { a = calcul(a + b) }
            a = calcul(3 * a)
            b = calcul(3 * b)
          }
          expf = `Le produit du tiers de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par le double de la somme de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$\\left((${texNombrec(a)}-${texNombrec(b)}) \\div  3\\right) \\times  2${signex}(${texNombrec(c)}+${texNombrec(d)})$`
          expc = `$\\left((${texNombrec(a)}-${texNombrec(b)}) \\div  3\\right) \\times  2${signex}(${texNombrec(c)}+${texNombrec(d)}) = ${texNombrec(a - b)} \\div  3  \\times  2  \\times ${texNombrec(c + d)} = ${texNombrec((a - b) / 3)}  \\times  2  \\times  ${texNombrec(c + d)} =  ${texNombrec(2 * (a - b) / 3)}  \\times  ${texNombrec(c + d)} = ${texNombrec(2 * (c + d) * (a - b) / 3)}$`
          repNum = arrondi(2 * (c + d) * (a - b) / 3)
          break
        case 4: // 3(a+b)-2(c+d)
          if (calculMental) { // Le résultat final sera ici, en moyenne, 7, 8 ou 9.
            c = randint(2, 5)
            d = randint(2, 5, [c])
            a = randint(1, 5, [c, d])
            b = Math.floor((c + d) * 2 / 3) + 3 - a
          } else {
            if (3 * (a + b) < 2 * (c + d)) { a = calcul(a + c + d) }
          }
          expf = `La différence entre le triple de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} et le double de la somme de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$3${signex}(${texNombrec(a)}+${texNombrec(b)})-2${signex}(${texNombrec(c)}+${texNombrec(d)})$`
          expc = `$3${signex}(${texNombrec(a)}+${texNombrec(b)})-2${signex}(${texNombrec(c)}+${texNombrec(d)}) = 3  \\times  ${texNombrec(a + b)} - 2  \\times  ${texNombrec(c + d)} = ${texNombrec(3 * (a + b))} - ${texNombrec(2 * (c + d))} = ${texNombrec(3 * (a + b) - 2 * (c + d))}$`
          repNum = arrondi(3 * (a + b) - 2 * (c + d))
          break
        case 5: // 2(a-b)+3(c+d)
          if (calculMental) { // 2(a-b)<11 et c+d<14
            b = randint(2, 9)
            a = randint(2, 5) + b
            c = randint(2, 10, [a, b])
            d = randint(2, 15 - c, [a, b, c])
          } else {
            if (a <= b) { a = calcul(a + b) }
          }
          expf = `La somme du double de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} et du triple de la somme de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)}`
          expn = `$2${signex}(${texNombrec(a)}-${texNombrec(b)})+3${signex}(${texNombrec(c)}+${texNombrec(d)})$`
          expc = `$2${signex}(${texNombrec(a)}-${texNombrec(b)})+3${signex}(${texNombrec(c)}+${texNombrec(d)}) = 2  \\times  ${texNombrec(a - b)} + 3  \\times  ${texNombrec(c + d)} = ${texNombrec(2 * (a - b))} + ${texNombrec(3 * (c + d))} = ${texNombrec(2 * (a - b) + 3 * (c + d))}$`
          repNum = arrondi(2 * (a - b) + 3 * (c + d))
          break
      }
      break
    case 4: // 4 opérations : Pffiouuu en calcul mental mais en papier, ce sera faisable par tous, sans calculatrice, même ceux faibles en calcul.
      souscas = randint(1, 3)
      switch (souscas) {
        case 1: // (a+b)/(c(d+e))
          if (calculMental) { // Dénominateur inférieur à 51. Resultat final : soit 1, 2 ou 10.
            d = randint(2, 8)
            e = randint(2, 11 - d, [d])
            c = randint(2, Math.floor(50 / (d + e)), [d, e])
            a = randint(2, c * (d + e) - 1)
            if (randint(1, 2) === 1) { b = choice([1, 2, 10]) * c * (d + e) - a } else { // Pour ne pas que a soit toujours le plus petit.
              b = a
              a = choice([1, 2, 10]) * c * (d + e) - b
            }
          } else {
            a = calcul(a * c * (d + e))
            b = calcul(b * c * (d + e))
          }
          expf = `Le quotient de la somme de ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par le produit de ${nombreAvecEspace(c)} par la somme de ${nombreAvecEspace(d)} et ${nombreAvecEspace(e)}`
          expn = `$(${texNombrec(a)}+${texNombrec(b)}) \\div (${texNombrec(c)}${signex}(${texNombrec(d)}+${texNombrec(e)}))$ ou $\\dfrac{${texNombrec(a)}+${texNombrec(b)}}{${texNombrec(c)}${signex}(${texNombrec(d)}+${texNombrec(e)})}$`
          expc = `$(${texNombrec(a)}+${texNombrec(b)}) \\div (${texNombrec(c)}${signex}(${texNombrec(d)}+${texNombrec(e)})) = ${texNombrec(a + b)}  \\div  (${texNombrec(c)}  \\times  ${texNombrec(d + e)}) = ${texNombrec(a + b)}  \\div  ${texNombrec(c * (d + e))} = ${texNombrec((a + b) / (c * (d + e)))}$`
          repNum = arrondi((a + b) / (c * (d + e)))
          break
        case 2: // (a-b)*(c+de)
          if (calculMental) { // a-b = 2 ou 4 ou 10 et c+de < 31.
            b = randint(2, 9)
            a = choice([2, 4, 10]) + b
            d = randint(2, 5, [a, b])
            e = randint(2, 5, [a, b, d])
            c = randint(2, 30 - d * e, [a, b, d, e])
          } else {
            if (a <= b) { a = calcul(a + b) }
          }
          expf = `Le produit de la différence entre ${nombreAvecEspace(a)} et ${nombreAvecEspace(b)} par la somme de ${nombreAvecEspace(c)} et du produit de ${nombreAvecEspace(d)} par ${nombreAvecEspace(e)}`
          expn = `$(${texNombrec(a)}-${texNombrec(b)})${signex}(${texNombrec(c)}+${texNombrec(d)} \\times ${texNombrec(e)})$`
          expc = `$(${texNombrec(a)}-${texNombrec(b)})${signex}(${texNombrec(c)}+${texNombrec(d)} \\times ${texNombrec(e)}) = ${texNombrec(a - b)}${signex}(${texNombrec(c)}+${texNombrec(d * e)}) = ${texNombrec(a - b)}  \\times  ${texNombrec(c + d * e)} = ${texNombrec((a - b) * (c + d * e))}$`
          repNum = arrondi((a - b) * (c + d * e))
          break
        case 3: // ab+cd/e
          if (calculMental) { // Une simplification mentale en c et e sera nécessaire.
            a = randint(2, 6)
            b = randint(2, 6, [a])
            e = randint(2, 10, [a, b])
            c = randint(2, 5, [a, b]) * e
            d = randint(2, 6, [a, b, e, c])
          } else {
            c = calcul(c * e)
          }
          expf = `La somme du produit de ${nombreAvecEspace(a)} par ${nombreAvecEspace(b)} et du quotient du produit de ${nombreAvecEspace(c)} et ${nombreAvecEspace(d)} par ${nombreAvecEspace(e)}`
          expn = `$${texNombrec(a)} \\times ${texNombrec(b)}+${texNombrec(c)} \\times ${texNombrec(d)} \\div ${texNombrec(e)}$ ou $${texNombrec(a)} \\times ${texNombrec(b)}+\\dfrac{${texNombrec(c)} \\times ${texNombrec(d)}}{${texNombrec(e)}}$`
          expc = `$${texNombrec(a)} \\times ${texNombrec(b)}+${texNombrec(c)} \\times ${texNombrec(d)} \\div ${texNombrec(e)} = ${texNombrec(a * b)} + ${texNombrec(c * d)}  \\div  ${texNombrec(e)} = ${texNombrec(a * b)} + ${texNombrec(c * d / e)} = ${texNombrec(a * b + c * d / e)}$`
          repNum = arrondi(a * b + c * d / e)
          break
      }
      break
  }
  return [expf, expn, expc, souscas, repNum]
}
