import { test, expect } from '@playwright/test'
// import refToUuid from 'src/json/refToUuid.json' assert { type: 'json' }
import { readFileSync } from 'fs'

const jsonString = readFileSync('src/json/refToUuid.json', { encoding: 'utf8' })
const refToUuid = JSON.parse(jsonString)

const ids = Object.keys(refToUuid)

function TestAllPages (ids) {
  for (const id of ids) {
    const uuid = refToUuid[id]
    // if (id === '1E15') break
    test(`Exercice avec correction et 10 actualisations ${id}`, async ({ page }) => {
      const messages: string[] = []
      await page.goto(`http://localhost:5173/beta/?uuid=${uuid}`)
      // Listen for all console events and handle errors
      page.on('console', msg => {
        if (!msg.text().includes('[vite]')) {
          messages.push(msg.text())
        }
      })
      // Correction
      await page.locator('.bx-check-circle').first().click()
      // Actualiser
      await page.locator('.bx-refresh').first().click({ clickCount: 10 })
      // Paramètres
      await page.locator('.bx-cog').first().click()
      expect(messages.length).toBe(0)
    })
  }
}
TestAllPages(ids)
