
/* ============ COMMON Funtion ============ */

function fallbackCopyCB(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); }
    catch (e) { console.error(e); };
    document.body.removeChild(textArea);
}

/**
 * Copy text to clipboard
 * @param {string} text text to copy
 * @returns void
 */
function copyCB(text) {
    if (!navigator.clipboard) {
        fallbackCopyCB(text)
        return
    }
    navigator.clipboard.writeText(text)
}


// function Input(el) {
//     var parent = el,
//         map = {},
//         intervals = {};

//     function ev_kdown(ev) {
//         map[ ev.key ] = true;
//         ev.preventDefault();
//         return;
//     }

//     function ev_kup(ev) {
//         map[ ev.key ] = false;
//         ev.preventDefault();
//         return;
//     }

//     function key_down(key) {
//         return map[ key ];
//     }

//     function keys_down_array(array) {
//         for (var i = 0; i < array.length; i++)
//             if (!key_down(array[ i ]))
//                 return false;

//         return true;
//     }

//     function keys_down_arguments() {
//         return keys_down_array(Array.from(arguments));
//     }

//     function clear() {
//         map = {};
//     }

//     function watch_loop(keylist, callback) {
//         return function () {
//             if (keys_down_array(keylist))
//                 callback();
//         }
//     }

//     function watch(name, callback) {
//         var keylist = Array.from(arguments).splice(2);

//         intervals[ name ] = setInterval(watch_loop(keylist, callback), 1000 / 24);
//     }

//     function unwatch(name) {
//         clearInterval(intervals[ name ]);
//         delete intervals[ name ];
//     }

//     function detach() {
//         parent.removeEventListener("keydown", ev_kdown);
//         parent.removeEventListener("keyup", ev_kup);
//     }

//     function attach() {
//         parent.addEventListener("keydown", ev_kdown);
//         parent.addEventListener("keyup", ev_kup);
//     }

//     function Input() {
//         attach();

//         return {
//             key_down: key_down,
//             keys_down: keys_down_arguments,
//             watch: watch,
//             unwatch: unwatch,
//             clear: clear,
//             detach: detach
//         };
//     }

//     return Input();
// }













/* ============ INIT FUNCTIONS ============ */
let INIT_FUNCTIONS = {}

/**
 * Usage: <class="nht_btn-copy" data-copy="text to copy">
 */
INIT_FUNCTIONS.fluent = () => {
    document.body.classList.add('fluent')
}


INIT_FUNCTIONS.btnCopy = () => {
    document.querySelectorAll('.nht_btn-copy').forEach(btn => {
        btn.addEventListener('click', async(e) => {
            const data = btn.getAttribute('data-copy')
            const type = btn.getAttribute('data-type')
            if (data && data != 'null'){
                if(type == 'file'){
                    const blob = await fetch(data).then(res => res.blob())
                    if(blob.type.includes('image')){
                        // png type
                        if (blob.type.includes('png')) {
                            navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
                        }
                        // other type 
                        else {
                            const img = new Image
                            const c = document.createElement('canvas')
                            const ctx = c.getContext('2d')
                            function setCanvasImage(blob, func) {
                                img.onload = function () {
                                    c.width = this.naturalWidth
                                    c.height = this.naturalHeight
                                    ctx.drawImage(this, 0, 0)
                                    c.toBlob(blob => {
                                        func(blob)
                                    }, 'image/png')
                                }
                                img.src = URL.createObjectURL(blob)
                            }
                            setCanvasImage(blob, (pngBlob) => {
                                navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
                            })
                        }
                    }
                }else{
                    copyCB(data)
                }
            }
        })
    })
}


INIT_FUNCTIONS.btnDownload = () => {
    document.querySelectorAll('.nht_btn-download').forEach(async (btn) => {
        const url = btn.getAttribute('data-url')
        let name = btn.getAttribute('data-name')
        if(url){
            if (!name) name = url.split('/').pop()
            btn.addEventListener('click', async (e) => {
                const blob = await fetch(url).then(res => res.blob())
                let link = document.createElement("a")
                link.download = name || String(new Date().getTime())
                link.href = URL.createObjectURL(blob)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        }
    })
}


INIT_FUNCTIONS.nhticon = () => {
    const els = document.querySelectorAll('.nht_icon')
    if(els.length){
        els.forEach(el => {
            const elClass = el.className
            for(const i in ICONS){
                if(elClass.includes(i)){
                    el.innerHTML = ICONS[i]
                }
            }
        })
    }
}





/* ============ IMPORT LIBRARY ============ */
document.addEventListener('import.flaticon', () => {
    const urls = [
        'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css',
        'https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css',
        'https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css'
    ]
    urls.forEach(url => {
        const src = document.createElement('link')
        src.rel = 'stylesheet'
        src.href = url
        document.head.appendChild(src)
    })
})










/* ====== START nht_icon ====== */

const ICONS = {

    'no-data': `<svg viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg" class="nht_svg no-data" style="width: 64px; height: 41px;"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse><g fill-rule="nonzero" stroke="#D9D9D9"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA"></path></g></g></svg>`,

    'rounded-expand': '<svg class="nht_svg rounded-expand" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.5,15.5A1.5,1.5,0,0,0,21,17v1.5A2.5,2.5,0,0,1,18.5,21H17a1.5,1.5,0,0,0,0,3h1.5A5.506,5.506,0,0,0,24,18.5V17A1.5,1.5,0,0,0,22.5,15.5Z"/><path d="M7,0H5.5A5.506,5.506,0,0,0,0,5.5V7A1.5,1.5,0,0,0,3,7V5.5A2.5,2.5,0,0,1,5.5,3H7A1.5,1.5,0,0,0,7,0Z"/><path d="M7,21H5.5A2.5,2.5,0,0,1,3,18.5V17a1.5,1.5,0,0,0-3,0v1.5A5.506,5.506,0,0,0,5.5,24H7a1.5,1.5,0,0,0,0-3Z"/><path d="M18.5,0H17a1.5,1.5,0,0,0,0,3h1.5A2.5,2.5,0,0,1,21,5.5V7a1.5,1.5,0,0,0,3,0V5.5A5.506,5.506,0,0,0,18.5,0Z"/></svg>',

    'rounded-compress': '<svg class="nht_svg rounded-compress" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,2.5A6.5,6.5,0,0,1,2.5,9h-1a1.5,1.5,0,0,1,0-3h1A3.5,3.5,0,0,0,6,2.5v-1a1.5,1.5,0,0,1,3,0Z"/><path d="M16.5,24A1.5,1.5,0,0,1,15,22.5v-1A6.5,6.5,0,0,1,21.5,15h1a1.5,1.5,0,0,1,0,3h-1A3.5,3.5,0,0,0,18,21.5v1A1.5,1.5,0,0,1,16.5,24Z"/><path d="M22.5,9h-1A6.5,6.5,0,0,1,15,2.5v-1a1.5,1.5,0,0,1,3,0v1A3.5,3.5,0,0,0,21.5,6h1a1.5,1.5,0,0,1,0,3Z"/><path d="M7.5,24A1.5,1.5,0,0,1,6,22.5v-1A3.5,3.5,0,0,0,2.5,18h-1a1.5,1.5,0,0,1,0-3h1A6.5,6.5,0,0,1,9,21.5v1A1.5,1.5,0,0,1,7.5,24Z"/></svg>'

}


/* ====== END nht_icon ====== */
















/* ====== START nhtcss BUTTON ====== */

/**
 * 
 * @param {string} appendType "appendChild" | "prepend" | "after" | "before"
 * @param {string} appendEl DOM element to append to
 * @returns 
 */
const nhtcss_init = (appendType, appendEl) => {

    const modalPosition = (timeout = 0) => {
        setTimeout(() => {
            const modalSizeW = parseFloat(getComputedStyle(Modal).width.replace('px', ''))
            const modalSizeH = parseFloat(getComputedStyle(Modal).height.replace('px', ''))
            if (Modal.classList.contains('show')) {
                if (Modal.classList.contains('expand')) {
                    Modal.style.margin = '30px'
                    Modal.style.width = '100%'
                    Modal.style.maxWidth = '600px'
                    Modal.style.height = '100%'
                    Modal.style.maxHeight = 'calc(100vh - 60px)'
                    Modal.style.top = '0'
                    Modal.style.left = '50%'
                    Modal.style.transform = 'translateX(-50%)'
                } else {
                    Modal.style.margin = ''
                    Modal.style.width = ''
                    Modal.style.maxWidth = ''
                    Modal.style.height = ''
                    Modal.style.maxHeight = ''
                    Modal.style.top = ''
                    Modal.style.left = ''
                    Modal.style.transform = ''

                    if (modalSizeH > window.innerHeight) {
                        Modal.style.height = window.innerHeight + 'px'
                    }
                    if (modalSizeW > window.innerWidth) {
                        Modal.style.width = window.innerWidth - 60 * 1 + 'px'
                    }
                    if (Pos.x < window.innerWidth / 2) {
                        Modal.style.left = Pos.x * 1 + 40 * 1 + 'px'
                    } else {
                        Modal.style.left = Pos.x * 1 - 40 * 1 - modalSizeW * 1 + 'px'
                    }
                    if (window.innerHeight - Pos.y > modalSizeH) {
                        Modal.style.top = Pos.y * 1 - 25 * 1 + 'px'
                    } else if (Pos.y > modalSizeH) {
                        Modal.style.top = Pos.y * 1 - modalSizeH * 1 + 25 * 1 + 'px'
                    }

                }
            } else {
                // Modal.style.top = '0'
                // Modal.style.left = '-200%'
            }
        }, timeout);
    }

    const move = (e) => {
        if (!nhtcss.classList.contains("nht-active")) {
            let x, y
            if (e.type === "touchmove") {
                y = e.touches[ 0 ].clientY
                x = e.touches[ 0 ].clientX + "px";
            } else {
                y = e.clientY
                x = e.clientX
            }
            if (x > window.innerWidth || y > window.innerHeight) {
                nhtcss.dispatchEvent(new Event("mouseup"))
                return
            }
            Pos.x = x
            Pos.y = y
            nhtcss.style.top = y + "px";
            nhtcss.style.left = x + "px";
            modalPosition(210)
            localStorage.setItem('nhtcssBtnPos', JSON.stringify({ x, y }))
        }
    };

    const mouseDown = (e) => {
        Pos.oldX = Pos.x
        Pos.oldY = Pos.y
        Pos.y = parseFloat(getComputedStyle(nhtcss).top.replace('px', ''))
        Pos.x = parseFloat(getComputedStyle(nhtcss).left.replace('px', ''))
        if (e.type === "mousedown") {
            window.addEventListener("mousemove", move);
        } else {
            window.addEventListener("touchmove", move);
        }
        nhtcss.style.transition = "none";
        Modal.style.transition = "none";
    };

    const mouseUp = (e) => {
        if (e.type === "mouseup") {
            window.removeEventListener("mousemove", move);
        } else {
            window.removeEventListener("touchmove", move);
        }
        snapToSide();
        nhtcss.style.transition = "0.3s ease-in-out left";
        Modal.style.transition = "all 0.2s ease-in-out";
    };

    const snapToSide = (x, y) => {
        // const wrapperElement = document.body;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        if (!x || !y) {
            x = parseFloat(getComputedStyle(nhtcss).left.replace('px', ''))
            y = parseFloat(getComputedStyle(nhtcss).top.replace('px', ''))
        }
        if (y < 50) {
            y = 50
            nhtcss.style.top = y + "px"
        }
        if (y > windowHeight - 50) {
            y = windowHeight - 50
            nhtcss.style.top = y + "px";
        }
        if (x < windowWidth / 2) {
            x = 30
            nhtcss.style.left = x + "px";
            nhtcss.classList.remove('right');
            nhtcss.classList.add('left');
        } else {
            x = windowWidth - 45
            nhtcss.style.left = x + "px";
            nhtcss.classList.remove('left');
            nhtcss.classList.add('right');
        }
        Pos.x = x
        Pos.y = y
        modalPosition()
        localStorage.setItem('nhtcssBtnPos', JSON.stringify({ x, y }))
    };

    const btnPress = (type = 'toggle') => {
        // nhtcss.classList.add("nht-active");
        if (type === 'toggle') {
            Modal.classList.toggle('show')
        } else if (type === 'show') {
            Modal.classList.add('show')
        } else if (type === 'hide') {
            Modal.classList.remove('show')
        }

        modalPosition(210)

        document.dispatchEvent(new Event('nhtcss.click'))
        if (Modal.classList.contains('show')) {
            document.dispatchEvent(new Event('nhtcss.modal.show'))
        } else {
            document.dispatchEvent(new Event('nhtcss.modal.hide'))
        }
    }


    const nhtcss = (() => {
        const $nhtcss = document.createElement('nht')
        $nhtcss.className = '' // nhtcss-wrapper
        $nhtcss.innerHTML = `
            <div class="nht_modal fluent">
                <div class="modal-expand">
                    <div class="nht_icon rounded-expand" style="width: 18px;"></div>
                    <div class="nht_icon rounded-compress" style="width: 18px;"></div>
                </div>
                <div class="nht_modal-content">
                    <div class="d-flex-center" style="height: 80px">
                        <div class="nht_icon no-data"></div>
                    </div>
                </div>
            </div>
            <div class="nhtcss-btn-wrapper">
                <div class="nhtcss-btn">
                    <span>nht</span>
                </div>
            </div>`
        // <div class="close"><span>&times;</span></div>
        let element = null
        if(appendType && appendEl){
            const $appendEl = document.querySelector(appendEl)
            if(
                appendType === 'appendChild' ||
                appendType === 'prepend' || 
                appendType === 'after' ||
                appendType === 'before'){
                element = $appendEl[appendType]($nhtcss)
            }
            element = element.querySelector('.nhtcss-btn-wrapper')
        }else{
            element = document.body.appendChild($nhtcss).querySelector('.nhtcss-btn-wrapper')
        }
        let cPos = localStorage.getItem('nhtcssBtnPos')
        try {
            cPos = JSON.parse(cPos)
            element.style.top = cPos.y + 'px'
            setTimeout(() => {
                snapToSide(cPos.x, cPos.y)
            }, 10);
        } catch (e) { }
        return element
    })()

    const Modal = document.querySelector('.nht_modal')

    let Pos = {
        x: 0,
        y: 0,
        oldX: 0,
        oldY: 0
    }

    let KeyMap = {}
    
    const nhtcss_init = () => {

        nhtcss.addEventListener("mousedown", mouseDown);

        nhtcss.addEventListener("mouseup", mouseUp);

        nhtcss.addEventListener("touchstart", mouseDown);

        nhtcss.addEventListener("touchend", mouseUp);

        nhtcss.querySelector('.nhtcss-btn').addEventListener("click", (e) => {

            if (
                Pos.oldX == Pos.x &&
                Pos.oldY == Pos.y
            ) {
                btnPress()
            }

        });

        document.addEventListener('nhtcss.modal.active', (e) => {
            let type = 'show'
            if (e.detail && e.detail.type) type = e.detail.type
            btnPress(type)
        })

        window.addEventListener("resize", (e) => {
            snapToSide();
        })

        document.body.addEventListener('keydown', (e) => {
            KeyMap[ e.key ] = true
            if (KeyMap[ 'Escape' ] === true) {
                Modal.classList.remove('show')
                modalPosition(210)
            } else if (KeyMap[ 'Control' ] && KeyMap[ 'h' ]) {
                btnPress()
            }
        })

        document.body.addEventListener('keyup', (e) => {
            KeyMap[ e.key ] = false
        })

        document.querySelector('.nht_modal .modal-expand').addEventListener('click', (e) => {
            Modal.classList.toggle('expand')
            modalPosition()
            if (!Modal.classList.contains('expand')) {
                Modal.style.transition = 'none'
                modalPosition(5)
                setTimeout(() => {
                    Modal.style.transition = 'all 0.2s ease-in-out'
                }, 5)
            }
            if (Modal.classList.contains('expand')) {
                document.dispatchEvent(new Event('nhtcss.modal.expand'))
            } else {
                document.dispatchEvent(new Event('nhtcss.modal.compress'))
            }
        })
    
        return {
            nhtcss,
            Modal,
            KeyMap,
            btnPress,
            snapToSide,
            modalPosition
        }

    }

    return nhtcss_init()

}

/* ====== END nhtcss BUTTON ====== */













/* ============ MAIN CODE ============ */

// Init
init()
function init() {
    for (const i in INIT_FUNCTIONS) {
        try {
            INIT_FUNCTIONS[ i ]()
        } catch (e) { }
    }
}

// Listener for nhtcss button
document.addEventListener('nhtcss.buttonInit', e => {
    if (e.detail && e.detail.appendType && e.detail.appendEl) {
        nhtcss_init(e.detail.appendType, e.detail.appendEl)
    } else {
        nhtcss_init()
    }
})

// Import Flaticon
document.dispatchEvent(new Event('import.flaticon'))

// Init called via event
document.addEventListener('nhtcss.init', init)

// Check location change
let CURRENT_LOCATION = window.location.href
setInterval(()=>{
    if (CURRENT_LOCATION != window.location.href) {
        CURRENT_LOCATION = window.location.href
        document.dispatchEvent(new Event('location.change'))
    }
}, 500)


/* ============ nhtcss EVENT ============ */
/**
 * nhtcss.buttonInit: Init nhtcss button
 * nhtcss.modal.show: when modal show
 * nhtcss.modal.hide: when modal hide
 * nhtcss.modal.expand: when modal expand
 * nhtcss.modal.compress: when modal compress
 * nhtcss.click: when click on nhtcss button
 * nhtcss.init: to init global
 * nhtcss.modal.active: to active modal
 * import.flaticon: to import flaticon
 * location.change: when location had changed
 */