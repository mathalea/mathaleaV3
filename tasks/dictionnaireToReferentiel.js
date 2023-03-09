/**
 * Ce script met à jour le référentiel des exercices statiques en récupérant les mots clé et les url
 * dans les différents dictionnaires
 */

import fs from 'fs'
import { dictionnaireCrpe } from '../src/modules/dictionnaireCrpe.js'
import { dictionnaireCrpeCoop } from '../src/modules/dictionnaireCrpeCoop.js'
import { dictionnaireDNB } from '../src/modules/dictionnaireDNB.js'
import { dictionnaireBAC } from '../src/modules/dictionnaireBAC.js'
import { dictionnaireE3C } from '../src/modules/dictionnaireE3C.js'

const referentiel = {}

// Gestion du DNB
referentiel.DNB = {}
referentiel.DNBTags = {}
const setTagsDNB = new Set()

for (const ex in dictionnaireDNB) {
  dictionnaireDNB[ex].tags.forEach(e => {
    setTagsDNB.add(e)
  })
}

const tagsDNB = [...setTagsDNB].sort((a, b) => { return a.localeCompare(b) })
for (const annee of ['2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013']) {
  referentiel.DNB[annee] = {}
  for (const ex in dictionnaireDNB) {
    if (dictionnaireDNB[ex].annee === annee) {
      referentiel.DNB[annee][ex] = { uuid: ex, ...dictionnaireDNB[ex] }
    }
  }
}

for (const tag of tagsDNB) {
  referentiel.DNBTags[tag] = {}
  for (const ex in dictionnaireDNB) {
    if (dictionnaireDNB[ex].tags.includes(tag)) {
      referentiel.DNBTags[tag][ex] = { uuid: ex, ...dictionnaireDNB[ex] }
    }
  }
}

// Gestion du BAC
referentiel.BAC = {}
const setThemesBAC = new Set()

for (const ex in dictionnaireBAC) {
  dictionnaireBAC[ex].tags.forEach(e => {
    setThemesBAC.add(e)
  })
}

for (const annee of ['2021']) {
  referentiel.BAC[annee] = {}
  for (const ex in dictionnaireBAC) {
    if (dictionnaireBAC[ex].annee === annee) {
      referentiel.BAC[annee][ex] = { uuid: ex, ...dictionnaireBAC[ex] }
    }
  }
}

const tagsBAC = [...setThemesBAC].sort((a, b) => { return a.localeCompare(b) })
referentiel.BACTags = {}

for (const tag of tagsBAC) {
  referentiel.BACTags[tag] = {}
  for (const ex in dictionnaireBAC) {
    if (dictionnaireBAC[ex].tags.includes(tag)) {
      referentiel.BACTags[tag][ex] = { uuid: ex, ...dictionnaireBAC[ex] }
    }
  }
}

// Gestion du BAC
referentiel.E3C = {}
const setThemesE3C = new Set()

for (const ex in dictionnaireE3C) {
  dictionnaireE3C[ex].tags.forEach(e => {
    setThemesE3C.add(e)
  })
}

for (const annee of ['2021']) {
  referentiel.E3C[annee] = {}
  for (const ex in dictionnaireE3C) {
    if (dictionnaireE3C[ex].annee === annee) {
      referentiel.E3C[annee][ex] = { uuid: ex, ...dictionnaireE3C[ex] }
    }
  }
}

const tagsE3C = [...setThemesE3C].sort((a, b) => { return a.localeCompare(b) })
referentiel.E3CTags = {}

for (const tag of tagsE3C) {
  referentiel.E3CTags[tag] = {}
  for (const ex in dictionnaireE3C) {
    if (dictionnaireE3C[ex].tags.includes(tag)) {
      referentiel.E3CTags[tag][ex] = { uuid: ex, ...dictionnaireE3C[ex] }
    }
  }
}

// Gestion du CRPE version Coopmaths
referentiel.crpe = {}
const setThemesCrpe = new Set()

for (const ex in dictionnaireCrpeCoop) {
  dictionnaireCrpeCoop[ex].tags.forEach(e => {
    setThemesCrpe.add(e)
  })
}

for (const annee of ['2022']) {
  referentiel.crpe[annee] = {}
  for (const ex in dictionnaireCrpeCoop) {
    if (dictionnaireCrpeCoop[ex].annee === annee) {
      referentiel.crpe[annee][ex] = { uuid: ex, ...dictionnaireCrpeCoop[ex] }
    }
  }
}

const tagsCrpe = [...setThemesCrpe].sort((a, b) => { return a.localeCompare(b) })
referentiel.crpeTags = {}

for (const tag of tagsCrpe) {
  referentiel.crpeTags[tag] = {}
  for (const ex in dictionnaireCrpeCoop) {
    if (dictionnaireCrpeCoop[ex].tags.includes(tag)) {
      referentiel.crpeTags[tag][ex] = { uuid: ex, ...dictionnaireCrpeCoop[ex] }
    }
  }
}

// Gestion du CRPE version Copirelem
referentiel.crpeCopirelem = {}
const setThemesCrpeCopirelem = new Set()

for (const ex in dictionnaireCrpe) {
  dictionnaireCrpe[ex].tags.forEach(e => {
    setThemesCrpeCopirelem.add(e)
  })
}

for (const annee of ['2019', '2018', '2017', '2016', '2015']) {
  referentiel.crpeCopirelem[annee] = {}
  for (const ex in dictionnaireCrpe) {
    if (dictionnaireCrpe[ex].annee === annee) {
      referentiel.crpeCopirelem[annee][ex] = { uuid: ex, ...dictionnaireCrpe[ex] }
    }
  }
}

const tagsCrpeCopirelem = [...setThemesCrpeCopirelem].sort((a, b) => { return a.localeCompare(b) })
referentiel.crpeCopirelemTags = {}

for (const tag of tagsCrpeCopirelem) {
  referentiel.crpeCopirelemTags[tag] = {}
  for (const ex in dictionnaireCrpe) {
    if (dictionnaireCrpe[ex].tags.includes(tag)) {
      referentiel.crpeCopirelemTags[tag][ex] = { uuid: ex, ...dictionnaireCrpe[ex] }
    }
  }
}

// On renomme les clés à la racine du référentiel
delete Object.assign(referentiel, { 'Brevet des collèges par thèmes - APMEP': referentiel.DNBTags }).DNBTags
delete Object.assign(referentiel, { 'Brevet des collèges par année - APMEP': referentiel.DNB }).DNB
delete Object.assign(referentiel, { 'BAC par thèmes - APMEP': referentiel.BACTags }).BACTags
delete Object.assign(referentiel, { 'BAC par année - APMEP': referentiel.BAC }).BAC
delete Object.assign(referentiel, { 'CRPE (2015-2019) par thèmes - COPIRELEM': referentiel.crpeCopirelemTags }).crpeCopirelemTags
delete Object.assign(referentiel, { 'CRPE (2015-2019) par année - COPIRELEM': referentiel.crpeCopirelem }).crpeCopirelem
delete Object.assign(referentiel, { 'CRPE (2022) par thèmes': referentiel.crpeTags }).crpeTags
delete Object.assign(referentiel, { 'CRPE (2022) par année': referentiel.crpe }).crpe
delete Object.assign(referentiel, { 'E3C par thèmes - APMEP': referentiel.E3CTags }).E3CTags
delete Object.assign(referentiel, { 'E3C par specimen - APMEP': referentiel.E3C }).E3C

const data = JSON.stringify(referentiel, null, 2)
fs.writeFileSync('src/json/referentielStatic.json', data)
