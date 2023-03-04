const $html = document.getElementsByTagName('html')[ 0 ]
let isDark = $html.getAttribute('dark')
if (!isDark && isDark === '') isDark = true
if(isDark){
    $html.classList.add('lpm')
}

document.dispatchEvent(new CustomEvent('nhtcss.cmdK', {
    detail: { el: 'input#search' }
}))


function run(params) {
    
}