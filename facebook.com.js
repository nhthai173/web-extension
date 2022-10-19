const $html = document.getElementsByTagName('html')[ 0 ]



/**
 * Get current theme
 * @returns "dark" | "light"
 */
function getCurrentTheme() {
    const el = $html
    const isDark = el.classList.contains('__fb-dark-mode')
    const isLight = el.classList.contains('__fb-light-mode')
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches
    return isDark ? 'dark' : isLight ? 'light' : system ? 'dark' : 'light'
}

// Event occurs when the theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    themeChange()
});
new MutationObserver((mutations, observer) => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            themeChange()
        }
    })
}).observe($html, { attributes: true })



const customPage = () => {
    const url = window.location.href

    // Change css variables
    const matches = []
    const className = {
        'sbg': [ '/watch', '/friends', '/groups/feed']
    }
    for(const i in className) {
        if (className[i].some(v => url.includes(v))) {
            document.body.classList.add(i)
            matches.push(i)
        }
    }
    for(const i in className) {
        if (!matches.includes(i)) {
            document.body.classList.remove(i)
        }
    }

    // Remove background image in reel
    const imgs = document.querySelectorAll('img')
    if (imgs && imgs.length) {
        for(const i in imgs){
            const img = imgs[i]
            const height = parseFloat(getComputedStyle(img).height)
            const width = parseFloat(getComputedStyle(img).width)
            const ratio = height / width
            const src = img.src
            console.log(img, height, width, !src.includes('static'))
            if(isNaN(ratio) && ratio !== 1 && width > height && !src.includes('static')){
                // reelBg.src = ''
                img.classList.add('d-none')
                console.log('removed reel bg')
            }
        }
    }

}


const themeChange = () => {
    THEME = getCurrentTheme()
    document.body.classList.remove('lpm', 'dark')
    if (THEME === 'dark') {
        document.body.classList.add('lpm', 'dark')
    }
    customPage()
}




/* MAIN CODE */
var THEME = getCurrentTheme()

themeChange()
setTimeout(themeChange, 3000)

document.addEventListener('location.change', customPage)

window.addEventListener('scroll', () => {
    document.body.getElementsByTagName('div')[0].querySelectorAll('div').forEach(el => {
        if (THEME == 'dark' && el.getAttribute('style')) {
            const style = el.getAttribute('style')
            // const bg = getComputedStyle(el).backgroundColor.trim()
            // const bgimg = getComputedStyle(el).backgroundImage.trim()
            let match = false
            if(style){
                if (style.includes('rgb')) {
                    // el.style.backgroundColor = 'transparent'
                    el.classList.add('card-bg')
                    match = true
                }
                if (style.includes('url') || style.includes('gradient')) {
                    // el.style.backgroundImage = 'none'
                    el.classList.add('card-bg')
                    match = true
                }
            }
            if(match){
                el.querySelectorAll('div').forEach(el => {
                    // const tc = getComputedStyle(el).color
                    const style = el.getAttribute('style')
                    if (style && style.includes('rgb')) {
                        // el.style.color = '#fff'
                        el.classList.add('card-bg-text')
                    }
                })
            }
        }
    })
});

function run() {
    
}