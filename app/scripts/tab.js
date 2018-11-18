import $ from 'jquery'
window.jQuery = $
window.$ = $

$('.next-step').click(function () {
  $('.nav-item > .active').parent().next('li').find('a').trigger('click')
})

$('.prev-step').click(function () {
  $('.nav-item > .active').parent().prev('li').find('a').trigger('click')
})
