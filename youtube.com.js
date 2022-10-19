const $html = document.getElementsByTagName('html')[ 0 ]
let isDark = $html.getAttribute('dark')
if (!isDark && isDark === '') isDark = true
if(isDark){
    $html.classList.add('lpm')
}

function run(params) {
    
}