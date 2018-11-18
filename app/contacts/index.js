import '../styles/main.scss'
import 'bootstrap'
import '../scripts/nav.js'

if (process.env.NODE_ENV !== 'production') {
  require('./contacts.pug')
}
