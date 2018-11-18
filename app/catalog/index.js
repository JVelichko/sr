import 'bootstrap'
import '../styles/main.scss'
import '../scripts/nav.js'

if (process.env.NODE_ENV !== 'production') {
  require('./catalog.pug')
}
