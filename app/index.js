import './styles/main.scss'
import 'bootstrap'

import './scripts/tab.js'
import './scripts/nav.js'

if (process.env.NODE_ENV !== 'production') {
  require('./index.pug')
}
