import 'boxicons/css/boxicons.min.css'
import './app.css'
import App from './components/App.svelte'
import * as BigInt from 'bigint-polyfill'
window.BigInt = BigInt
const app = new App({
  target: document.getElementById('app')
})

export default app
