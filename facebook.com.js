// Configurations
// Next: Able to change in UI
const USE_LOW_POWER_MODE = true
const REMOVE_LEFT_SIDEBAR = true
const REMOVE_LEFT_SIDEBAR_PATH = [ '/' ]
const REMOVE_RIGHT_SIDEBAR = true
const REMOVE_RIGHT_SIDEBAR_PATH = [ '/' ]
const REMOVE_REEL_BACKGROUND = false // always remove
const REMOVE_REEL_BACKGROUND_IN_LPM = true // only remove in lpm
const REMOVE_POST_BACKGROUND_IN_LPM = true // only remove in lpm

// leave empty to use default
const CUSTOM_PRIMARY_COLOR = '210, 110, 100'
const CUSTOM_PRIMARY_COLOR_DARK = '240, 144, 127'
const CUSTOM_PRIMARY_COLOR_LPM = '240, 144, 127'
const CUSTOM_SECONDARY_COLOR = '210, 110, 100' // for /groups
const FILTER_ACCENT = 'invert(65%) sepia(54%) saturate(200%) saturate(190%) saturate(200%) saturate(200%) hue-rotate(313deg) brightness(120%) contrast(69%)'
const FILTER_PRIMARY_FOR_BLACK_BASEED = 'invert(23%) sepia(54%) saturate(200%) saturate(190%) saturate(200%) saturate(200%) hue-rotate(483deg) brightness(140%) contrast(70%)'
const FILTER_BLUE_ICON_LIGHT = 'invert(5%) sepia(54%) hue-rotate(500deg) brightness(139%) contrast(95%) saturate(154%)'
const FILTER_BLUE_ICON_DARK = 'invert(5%) sepia(54%) hue-rotate(500deg) brightness(139%) contrast(76%) saturate(154%)'



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


function setCssAttribute(string = '', el) {
    el = el || document.body
    let style = []
    if (string.includes(';')) {
        style = string.split(';')
    }
    if (style.length) {
        style = style.map(s => {
            let splits = s.split(':')
            let key = splits[ 0 ].trim()
            splits = splits.slice(1)
            let value = splits.join(':').trim()
            return { key, value }
        })
        style.forEach(s => {
            if (s.key && s.value)
                return el.style.setProperty(s.key, s.value)
        })
        return false
    }
}


function matchBlueColorInline(el){
    if(!el) return false
    const style = el.getAttribute('style') || ''
    let matchColor = style.match(/(^|;|\s)+(?=color).*?(?=;)/g)
    if (matchColor) {
        try{
            matchColor = matchColor.pop()
            matchColor = matchColor.split(':').pop()
            let [ r, g, b ] = matchColor.split(',')
                .map(s => {
                    const matchNum = s.match(/\d+/g)
                    if (matchNum) return parseInt(matchNum[ 0 ])
                    return 0
                })
            if (r !== g && g !== b && r !== b) {
                const max = Math.max(r, g, b)
                if (max && max === b) return true
            }
        }catch(e){}
    }
    return false
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

    // Add class to body base on url
    const matches = []
    const className = {
        'sbg': [ '/watch', '/friends', '/groups/feed' ]
    }
    for (const i in className) {
        if (className[ i ].some(v => url.includes(v))) {
            document.body.classList.add(i)
            matches.push(i)
        }
    }
    for (const i in className) {
        if (!matches.includes(i)) {
            document.body.classList.remove(i)
        }
    }

    if (CUSTOM_PRIMARY_COLOR) {

        // Change video progress bar
        document.querySelectorAll('div[role="slider"] div[data-visualcompletion="ignore"]').forEach(el => {
            // prorgress
            if (el.hasChildNodes()){
                el.classList.add('nyan-cat-progress')
                // thumb
                const div = el.querySelector('div')
                if (div) {
                    div.classList.add('nyan-cat', 'fb-nyan-cat')
                }
            }
            // load
            else{
                el.classList.add('nyan-cat-load')
            }
        })

    }

    document.querySelectorAll('div').forEach(el => {
        
        // Custom secondary color (in /groups)
        if (CUSTOM_SECONDARY_COLOR) {
            const secondaryAttr = getComputedStyle(el).getPropertyValue('--secondary-text')
            if (!secondaryAttr.toLowerCase().includes('65676b') &&
                !secondaryAttr.toLowerCase().includes('b0b3b8')) {
                el.style.setProperty('--secondary-text', 'rgb(var(--custom-primary))')
                el.style.setProperty('--secondary-icon', 'rgb(var(--custom-primary))')
            }
        }

        // Change inline css color
        if(CUSTOM_PRIMARY_COLOR && matchBlueColorInline(el)){
            el.classList.add('custom-text-color')
        }

        // Remove post background
        if (REMOVE_POST_BACKGROUND_IN_LPM) {
            if (THEME == 'dark' && el.getAttribute('style')) {
                const style = el.getAttribute('style')
                // const bg = getComputedStyle(el).backgroundColor.trim()
                // const bgimg = getComputedStyle(el).backgroundImage.trim()
                let match = false
                if (style) {
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
                if (match) {
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
        }

        // Hide right side bar
        if (REMOVE_RIGHT_SIDEBAR) {
            let match = false
            if (REMOVE_RIGHT_SIDEBAR_PATH && REMOVE_RIGHT_SIDEBAR_PATH.length) {
                REMOVE_RIGHT_SIDEBAR_PATH.forEach(path => {
                    if (path == '*')
                        match = true
                    else if (path.includes('*')) {
                        if (location.pathname.startsWith(path.replace(/\*/g, '')))
                            match = true
                    } else if (path === location.pathname)
                        match = true
                })
            }else{
                match = true
            }
            if (match) {
                const role = el.getAttribute('role')
                if (role) {
                    if (role === 'complementary')
                        el.classList.add('d-none-important')
                }
            }
        }

    })

    document.querySelectorAll('span').forEach(el => {
        // Change inline css color
        if (CUSTOM_PRIMARY_COLOR && matchBlueColorInline(el)) {
            el.classList.add('custom-text-color')
        }
    })

    // Remove custom color when inline css is changed
    document.querySelectorAll('.custom-text-color').forEach(el => {
        if (!matchBlueColorInline(el)) {
            el.classList.remove('custom-text-color')
        }
    })

    // Hide left side bar
    if (REMOVE_LEFT_SIDEBAR) {
        let match = false
        if (REMOVE_LEFT_SIDEBAR_PATH && REMOVE_LEFT_SIDEBAR_PATH.length){
            REMOVE_LEFT_SIDEBAR_PATH.forEach(path => {
                if (path == '*')
                    match = true
                else if(path.includes('*')){
                    if(location.pathname.startsWith(path.replace(/\*/g, '')))
                        match = true
                }else if(path === location.pathname)
                    match = true
            })
        }else{
            match = true
        }
        if(match){
            const navs = document.querySelectorAll('div[role="navigation"]')
            if (navs.length && navs[ 2 ]) {
                navs[ 2 ].classList.add('d-none-important')
            }
        }
    }

    // Remove background image in reel
    document.querySelectorAll('div[role="main"]').forEach(main => {
        main.querySelectorAll('img').forEach(img => {
            if (url.includes('/reel')) {
                if (REMOVE_REEL_BACKGROUND) {
                    img.classList.add('reel-img-d-none')
                } else if (REMOVE_REEL_BACKGROUND_IN_LPM) {
                    img.classList.add('reel-img-d-none-lpm')
                }
            }else{
                img.classList.remove('reel-img-d-none', 'reel-img-d-none-lpm')
            }
        })
    })

    // Custom icon filter
    document.querySelectorAll('i[data-visualcompletion="css-img"]').forEach(el => {
        const src = getComputedStyle(el).backgroundImage
        const pos = getComputedStyle(el).backgroundPosition

        // plus
        if (FILTER_PRIMARY_FOR_BLACK_BASEED) {
            // console.log({ src, pos, srcIn: src.includes('/rsrc.php/v3/yD/r/QU5tc3w7IQr'), posIn: pos.includes('0px -24px') })
            if (src.includes('/rsrc.php/v3/yD/r/QU5tc3w7IQr') && pos.includes('-61px -105px')) {
                el.classList.add('custom-icon-filter')
            }
        }

        // blue icon
        if (FILTER_BLUE_ICON_LIGHT || FILTER_BLUE_ICON_DARK) {
            const posList = [ 
                // blue tick
                '-47px -164px', '-51px -164px', '-73px -84px', '-101px -126px', '-173px -59px', '0px -187px', '-147px -166px', '-168px -166px', '-34px -164px', '-84px -126px', '-149px -147px', '-59px -126px', 
                '-176px -59px', '-42px -126px',
                // watch icon
                '0px -197px',
                '0px -1856px',
                '0px -1885px',
                '0px -481px',
                // liked icon
                '0px -100px',
                // group icon
                '0px -986px',
                '0px -74px',
                // post icon
                '0px -1479px',
                '0px -1711px',
                '0px -1508px',
                // shield icon
                '0px -1624px',
                '0px -1653px',
                // friends icon
                '0px -259px',
                '0px -899px',
                // recent icon
                '0px -407px',
                // makert icon
                '0px -370px',
                // game icon
                '0px -37px',
            ]
            posList.forEach(p => {
                if (pos.includes(p))
                    el.classList.add('blue-icon-filter')
            })
        }

    })

}


const themeChange = () => {
    THEME = getCurrentTheme()
    if (USE_LOW_POWER_MODE) {
        document.body.classList.remove('lpm', 'dark')
        if (THEME === 'dark') {
            document.body.classList.add('lpm', 'dark')
        }
    }
    customPage()
}


const primaryChange = () => {
    if (CUSTOM_PRIMARY_COLOR) {
        setCssAttribute(`--custom-primary: ${CUSTOM_PRIMARY_COLOR};`)
    }
    if (CUSTOM_PRIMARY_COLOR_DARK) {
        setCssAttribute(`--custom-primary-dark: ${CUSTOM_PRIMARY_COLOR_DARK};`)
    }
    if (CUSTOM_PRIMARY_COLOR_LPM) {
        setCssAttribute(`--custom-primary-lpm: ${CUSTOM_PRIMARY_COLOR_LPM};`)
    }
    if (FILTER_ACCENT) {
        setCssAttribute(`--custom-filter-accent: ${FILTER_ACCENT};`)
    }
    if (FILTER_PRIMARY_FOR_BLACK_BASEED) {
        setCssAttribute(`--custom-icon-filter: ${FILTER_PRIMARY_FOR_BLACK_BASEED};`)
    }
    if (FILTER_BLUE_ICON_LIGHT) {
        setCssAttribute(`--blue-icon-filter-light: ${FILTER_BLUE_ICON_LIGHT};`)
    }
    if (FILTER_BLUE_ICON_DARK) {
        setCssAttribute(`--blue-icon-filter-dark: ${FILTER_BLUE_ICON_DARK};`)
    }
}




/* MAIN CODE */
var THEME = getCurrentTheme()

themeChange()
primaryChange()
setTimeout(themeChange, 3000)

document.addEventListener('location.change', customPage)
window.addEventListener('scroll', customPage)

setInterval(customPage, 100);

function run() {

}