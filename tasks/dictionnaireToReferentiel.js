import fs from 'fs'
import { dictionnaireCrpe } from '../src/modules/dictionnaireCrpe.js'
import { dictionnaireDNB } from '../src/modules/dictionnaireDNB.js'

const referentiel = {}
referentiel.crpeCopirelem = {}
const setThemesCrpeCopirelem = new Set()

for (const ex in dictionnaireCrpe) {
  dictionnaireCrpe[ex].tags.forEach(e => {
    setThemesCrpeCopirelem.add(e)
  })
}

for (const annee of ['2015', '2016', '2017', '2018', '2019']) {
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

referentiel.DNB = {}
referentiel.DNBTags = {}
const setTagsDNB = new Set()

for (const ex in dictionnaireDNB) {
  dictionnaireDNB[ex].tags.forEach(e => {
    setTagsDNB.add(e)
  })
}

const tagsDNB = [...setTagsDNB].sort((a, b) => { return a.localeCompare(b) })

for (const annee of ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']) {
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

const data = JSON.stringify(referentiel, null, 2)
fs.writeFileSync('src/json/referentielStatic.json', data)
