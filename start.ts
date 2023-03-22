import mathaleaLoader from './src/mathaleaLoader'
import { freezeUrl } from './src/components/store'
import type { InterfaceLoaderParams } from './src/lib/types'
const app = document.getElementById('app') as HTMLElement
const loaderParams: InterfaceLoaderParams = {
  container: app
  // globalOptions: { v: 'eleve' },
  // exercicesParams: [{ uuid: 'b72b0', nbQuestions: 4 }]
}
freezeUrl.set(false)

mathaleaLoader(loaderParams)
