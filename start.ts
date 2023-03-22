import mathaleaLoader from './src/mathaleaLoader'
const app = document.getElementById('app')
const loaderParams = {
  container: app,
  globalOptions: { v: '' },
  exercicesParams: [{ uuid: 'b72b0' }]
}
mathaleaLoader(loaderParams)
