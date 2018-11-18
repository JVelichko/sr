import 'bootstrap'
import '../../styles/main.scss'
import '../../scripts/nav.js'
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;
import '../../scripts/spoiler.js'

if (process.env.NODE_ENV !== 'production') {
  require('./industrial.pug')
}
