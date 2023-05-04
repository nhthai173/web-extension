/**
 * Get short type of product
 * @returns HTML string
 */
function getShopeeShortURLHTML() {
    let url = document.baseURI
    let idMatch = url.match(/i\.(\d+)\.(\d+)/)
    if (idMatch && idMatch.length == 3) {
        url = 'https://shopee.vn/product/' + idMatch[ 1 ] + '/' + idMatch[ 2 ]
        return `
            <div class="nht_card nht_shopee-short-url">
                <div class="item">
                    <span class="title">Short URL</span>
                </div>
                <div class="item" style="margin-left: auto!important;">
                    <button type="button" class="btn btn-solid-primary nht_btn-copy" aria-disabled="false" data-copy="${url}">Copy</button>
                </div>
            </div>`
    }
    return ''
}

/**
 * Get image url from background-image
 * @param {string} bgUrl
 * @returns image url
 */
function parseImgUrl(bgUrl = '') {
    if (!bgUrl)
        return
    if (!bgUrl.includes('url('))
        return
    // if (bgUrl.indexOf('cf.shopee') === -1)
    //     return
    // if (bgUrl.indexOf('data:image') !== -1)
    //     return
    return bgUrl.replace(/^url\((['"]?)(.*)\1\)$/, '$2').replace(/_+\w+/, '')
}

/**
 * Get html of images to show in popup
 * @return HTML string
 */
function getImagesHTML() {
    let html = ''
    if (IMAGES.length) {
        IMAGES.forEach(img => {
            if(APPENDED.IMAGES.includes(img)) return
            html += `<div class="nht_card-img center w-100"><img src="${img}" /></div>`
            APPENDED.IMAGES.push(img)
        })
    }
    if (html) {
        const el = document.createElement('div')
        el.className = 'nht_shopee-img-wrapper'
        el.innerHTML = html
        return el
    }
    return null
}

/**
 * Get html of videos to show in popup
 * @return HTML string
 */
function getVideosHTML(){
    let html = ''
    if (VIDEOS.length) {
        VIDEOS.forEach(video => {
            if(APPENDED.VIDEOS.includes(video)) return
            html += `<div class="nht_card-img center w-100"><video src="${video}" controls loop></video></div>`
            APPENDED.VIDEOS.push(video)
        })
    }
    if (html) {
        const el = document.createElement('div')
        el.className = 'nht_shopee-img-wrapper'
        el.innerHTML = html
        return el
    }
    return null
}

function lazyInit(){
    document.dispatchEvent(new Event('nhtcss.init'))
}

function setModalToDefault() { 
    const modalContent = document.querySelector('.nht_modal-content')
    if (modalContent) {
        modalContent.innerHTML = `
            ${getShopeeShortURLHTML()}
            <div class="d-flex-center no-data-placeholder" style="height: 80px"><div class="nht_icon no-data"></div>
            </div>
            <div class="shopee_videos"></div>
            <div class="shopee_images"></div>
        `
        lazyInit()
    }
}

/**
 * Show nhtcss popup
 */
function showModal() {
    document.dispatchEvent(new Event('nhtcss.modal.active'))
}

/**
 * Hide nhtcss popup
 */
function hideModal() {
    document.dispatchEvent(new CustomEvent('nhtcss.modal.active', { detail: { type: 'hide' } }))
}

/**
 * Callback of MutationObserver
 * @param {*} mutationList 
 * @param {*} observer 
 */
const autoHidePopupCB = (mutationList, observer) => {
    const hide = () => {
        if (!$nhtModal.classList.contains('expand-shopee')) {
            activeModalAgain = true
            if (!$nhtModal.classList.contains('clicked'))
                hideModal()
        }
    }
    const show = () => {
        activeModalAgain = false
        showModal()
    }
    mutationList.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const el = mutation.target
            AUTO_HIDE_POPUP_BY_CLASS.forEach(d => {
                if(d.matchEl && d.matchEl(el)){
                    if (d.matchType && d.matchType(el)) hide()
                    else if (activeModalAgain) show()
                }
            })
        }
    })
}

/**
 * Setup MutationObserver to auto hide popup
 * @param {string} type "class"
 * @param {HTMLElement} el
 * @param {function} matchEl 
 * @param {function} matchType 
 */
const autoHidePopup = (type = 'class', el, matchEl, matchType) =>{
    if(el && matchEl && matchType){
        if(type == 'class'){
            new MutationObserver(autoHidePopupCB).observe(el, { attributes: true })
            AUTO_HIDE_POPUP_BY_CLASS.push({matchEl, matchType})
        }
    }
}

/**
 * Append image actions when in product modal
 * @param {HTMLElement} el where to append
 * @param {String} imgURL image or video url
 * @param {Object} options action to show: "open", "copy", "download"
 */
function appendAction(el, imgURL, options = {open: true, download: true, copy: true}){
    let {open, download, copy} = options
    open = open === undefined ? true : open
    download = download === undefined ? true : download
    copy = copy === undefined ? true : copy
    if (el && imgURL) {
        const nel = document.createElement('div')
        nel.className = 'img-action'
        if(open){
            nel.innerHTML += `
                    <a  href="${imgURL}" target="_blank" type="button" 
                        class="btn btn-tinted" aria-disabled="false">
                        <i class="fi fi-rr-arrow-up-right-from-square"></i>
                    </a>`
        }
        if(download){
            nel.innerHTML += `
                    <button type="button" class="btn btn-tinted nht_btn-download" 
                            aria-disabled="false" data-url="${imgURL}">
                        <i class="fi fi-rr-inbox-in"></i>
                    </button>`
        }
        if(copy){
            nel.innerHTML += `
                    <button type="button" data-copy="${imgURL}" data-type="file" 
                            class="btn btn-tinted nht_btn-copy" aria-disabled="false">
                        <i class="fi fi-rr-duplicate"></i>
                    </button>`
        }
        let flexEl = el.parentElement
        while (!flexEl.className.includes('flex')) {
            flexEl = flexEl.parentElement
        }
        let item = flexEl.childNodes[ 1 ]
        item.style.position = 'relative'
        item.appendChild(nel)
        lazyInit()
    }
}


/**
 * Find and append image actions to all images in product modal
 */
function queryProductMedia(){
    const $modal = document.querySelector('#modal')
    const divs = $modal.querySelectorAll('div')
    const $video = $modal.querySelector('video')

    // remove old action
    const $imageAction = $modal.querySelector('.img-action')
    if($imageAction){
        $imageAction.remove()
    }
    
    // If video is showing
    if($video && getComputedStyle($video).display != 'none'){
        appendAction($video, $video.src, {copy: false})
    }
    // Image
    else if(divs.length){
        for (const div of divs) {
            const bgImg = getComputedStyle(div).getPropertyValue('background-image')
            if (bgImg && bgImg != 'none') {
                const imgURL = parseImgUrl(bgImg)
                if (imgURL) {
                    // Replace background image with img tag
                    div.style.paddingTop = 0
                    div.innerHTML = ''
                    const $img = document.createElement('img')
                    $img.src = imgURL
                    $img.style.width = '100%'
                    div.appendChild($img)
                    // Add image action
                    appendAction(div, imgURL)
                    break
                }
            }
        }
    }

}

/**
 * Find media in product rating
 * @returns {Boolean} true found any media
 */
function queryRatingMedia(){
    IMAGES = []
    VIDEOS = []
    const $rating = document.querySelector('.product-ratings')
    if ($rating) {
        $rating.querySelectorAll('.shopee-rating-media-list-image__content').forEach(div => {
            const bgImg = getComputedStyle(div).backgroundImage
            if (bgImg && bgImg != 'none') {
                const imgURL = parseImgUrl(bgImg)
                if (imgURL)
                    IMAGES.push(imgURL)
            }
        })
        $rating.querySelectorAll('video').forEach(video => {
            if (video.src) {
                VIDEOS.push(video.src)
            }
        })
        return IMAGES.length > 0 || VIDEOS.length > 0
    }
    return false
}








document.dispatchEvent(new CustomEvent('nhtcss.matchWithDarkReader'));
document.dispatchEvent(new CustomEvent('nhtcss.buttonInit'));
document.dispatchEvent(new Event('import.flaticon'))
document.dispatchEvent(new CustomEvent('nhtcss.cmdK', {
    detail: { el: 'input.shopee-searchbar-input__input' }
}))

let IMAGES = []
let VIDEOS = []
let APPENDED = {
    IMAGES: [],
    VIDEOS: []
}
let firstRun = false
let AUTO_HIDE_POPUP_BY_CLASS = []
let INTERVAL_SHOPEE_ID = null
let activeModalAgain = false // temporary variable use to auto hide popup
const $nhtModal = document.querySelector('.nht_modal')

// Append image actions to product modal when click
window.addEventListener('click', e => {
    queryProductMedia()
})

// Disable body scroll when popup in expanded
document.addEventListener('nhtcss.modal.expand', e => {
    document.body.classList.add('shopee-no-scroll')
    $nhtModal.classList.add('expand-shopee')
})

// Enable body scroll when popup in compressed
document.addEventListener('nhtcss.modal.compress', e => {
    document.body.classList.remove('shopee-no-scroll')
    $nhtModal.classList.remove('expand-shopee')
})

// Force show popup when click on nhtcss button
document.addEventListener('nhtcss.click', e => {
    $nhtModal.classList.add('clicked')
    setTimeout(() => {
        $nhtModal.classList.remove('clicked')
    }, 100);
})

// Auto play video when scroll in popup
document.querySelector('.nht_modal-content').addEventListener('scroll', e => {
    const currPos = e.target.scrollTop
    e.target.querySelectorAll('video').forEach(video => {
        const vidHieght = parseFloat(getComputedStyle(video).height) - 120
        if (video.offsetTop - 140 < currPos && currPos < video.offsetTop + vidHieght) {
            video.play()
        } else {
            video.pause()
        }
    })
})

// Auto play video when show
document.addEventListener('nhtcss.modal.show', e => {
    document.querySelector('.nht_modal-content').dispatchEvent(new Event('scroll'))
})

// Pause all video in popup when hide
document.addEventListener('nhtcss.modal.hide', e => {
    $nhtModal.querySelectorAll('video').forEach(video => video.pause())
})




/* ========= MAIN ========= */
setTimeout(run, 1000);

function run() {

    console.log('NHT SHOPEE SCRIPT RUNNING')

    if (!queryRatingMedia()) {
        // Force load rating media
        const filterAll = document.querySelector('.product-rating-overview__filter--all')
        if (filterAll) filterAll.dispatchEvent(new PointerEvent('click', { bubbles: true }))
        setTimeout(run, 1000);
        return
    }
    setModalToDefault()
    if (shopee_interval()){
        showModal()
        document.querySelector('.nht_modal .no-data-placeholder').remove()
        INTERVAL_SHOPEE_ID = setInterval(shopee_interval, 1000)
    }else{
        setTimeout(run, 1000);
    }

    if(!firstRun){
        firstRun = true

        // Reload when location change
        document.addEventListener('location.change', () => {
            console.log('location.change')
            if (INTERVAL_SHOPEE_ID) {
                clearInterval(INTERVAL_SHOPEE_ID)
            }
            APPENDED.IMAGES = []
            APPENDED.VIDEOS = []
            IMAGES = []
            VIDEOS = []
            setModalToDefault()
            hideModal()
            setTimeout(run, 1000)
        })

        // Auto hide popup when in product modal
        autoHidePopup(
            'class',
            document.body,
            (el) => el.nodeName.toLowerCase() == 'body',
            (el) => el.classList.contains('shopee-no-scroll'))
        
        // Auto hide popup when focus on search bar
        autoHidePopup(
            'class',
            document.querySelector('.shopee-searchbar'),
            (el) => el.classList.contains('shopee-searchbar'),
            (el) => el.classList.contains('shopee-searchbar--focus'))
    }

}

/**
 * Loop function
 * @returns {Boolean} true if appended any media
 */
function shopee_interval(){
    console.log('NHT SHOPEE INTERVAL RUNNING')
    queryRatingMedia()
    const imgs = getImagesHTML()
    const videos = getVideosHTML()
    if (videos) {
        const vids = document.querySelector('.nht_modal .shopee_videos').appendChild(videos)
        vids.querySelectorAll('video').forEach(vid => {
            vid.muted = true
        })
    }
    if (imgs) {
        document.querySelector('.nht_modal .shopee_images').appendChild(imgs)
    }
    return imgs || videos
}