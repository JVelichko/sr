import 'bootstrap'
import '../styles/main.scss'
import '../scripts/nav.js'
import '../scripts/spoiler.js'

if (process.env.NODE_ENV !== 'production') {
  require('./pervaporation.pug')
}
