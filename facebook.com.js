// Set to local storage
function setLocalStorage(key, value) {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}

// Get from local storage
function getLocalStorage(key) {
    const value = window.localStorage.getItem(key)
    try {
        return JSON.parse(value)
    } catch (e) { }
    return value
}





// Configurations
// Next: Able to change in UI
const USE_LOW_POWER_MODE = false
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
                '-47px -143px', '-168px -105px',
                '-34px -143px', '-172px -59px',
                '-81px -143px', '0px -126px', '-68px -143px', '-64px -143px',
                // watch icon
                '0px -2059px',
                // Video icon
                '0px -1189px',
                // story icon
                '0px -1914px',
                // Add story icon
                '0px -175px',
                // liked icon
                '0px -100px',
                // group icon
                '0px -1044px',
                // post icon
                '0px -1566px',
                '0px -1653px',
                // shield icon
                '0px -1798px',
                // friends icon
                '0px -957px',
                // recent icon
                // '0px -407px',
                // makert icon
                // '0px -370px',
                // game icon
                // '0px -37px',
                // Messenger icon
                // '0px -145px',
                // People tag icon
                // '0px -75px',
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


const appendConfigDialog = () => {
    const _append = () => {
        const options = [
            {
                name: 'Low power mode',
                id: 'USE_LOW_POWER_MODE',
                values: [{name: 'On', value: 'true'}, {name: 'Off', value: 'false'}]
            },
            {
                name: 'Remove left sidebar',
                id: 'REMOVE_LEFT_SIDEBAR',
                values: [{name: 'True', value: 'true'}, {name: 'False', value: 'false'}]
            },
            {
                name: 'Remove right sidebar',
                id: 'REMOVE_RIGHT_SIDEBAR',
                values: [{name: 'True', value: 'true'}, {name: 'False', value: 'false'}]
            }
        ]
        const $options = options.map(opt => {
            const vals = opt.values.map(val => `<option value="${val.value}">${val.name}</option>`)
            return `<div class="nhtcss-form-item">
                <label>${opt.name}</label>
                <div class="select">
                    <select name="${opt.id}">
                        ${vals.join('\n')}
                    </select>
                    <!-- <i class="arrow"></i> -->
                </div>
            </div>`
        })
        const dialog = document.createElement('div')
        dialog.className = 'nhtcss-modal-container'
        dialog.innerHTML = `<div class="nhtcss-modal">
            <div class="nhtcss-modal-body">
                <div class="nhtcss-modal-close">
                    <svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em"><path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z"></path></svg>
                </div>
                <div style="margin-top: 35px;"></div>
                ${$options.join('\n')}
            </div>
        </div>`
        document.body.prepend(dialog)
        document.querySelector('.nhtcss-modal-close').addEventListener('click', () => {
            dialog.remove()
        })
    }

    try {
        const isAppended = document.querySelectorAll('div[role=banner] div[role=dialog] div[role=list] [nhtcssBtn]').length
        if (isAppended) return
        let settingButton = document.querySelectorAll('div[role=banner] div[role=dialog] div[role=list] div[role=listitem]')[ 2 ]
        if (!settingButton) return
        const $dialogBtn = settingButton.cloneNode(true)
        $dialogBtn.querySelector('span[dir=auto]').innerText = 'NHTCSS'
        $dialogBtn.setAttribute('nhtcssBtn', 'true')
        $dialogBtn.addEventListener('click', () => {
            _append()
        })
        settingButton.after($dialogBtn)
    } catch (e) { console.error('appendConfigDialog', e) }
}


/* MAIN CODE */
var THEME = getCurrentTheme()

themeChange()
primaryChange()
setTimeout(themeChange, 3000)

document.addEventListener('location.change', customPage)
window.addEventListener('scroll', customPage)
document.dispatchEvent(new CustomEvent('nhtcss.cmdK', {
    detail: { el: 'input[dir="ltr"][role="combobox"]' }
}))


// setInterval(customPage, 100);
setInterval(() => {
    customPage()
    appendConfigDialog()    
}, 100);

function run() {

}