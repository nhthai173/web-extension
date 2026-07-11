// Bây giờ sẽ làm 1 cái nút để có thể ẩn cái ảnh nền trắng đó đi

// Begin

function getBgImages() {
    return document.querySelectorAll('#document-wrapper #page-container img.bi');
}

function isValid() {
    const bgImages = getBgImages();
    if (bgImages && bgImages.length) return true;
    return false;
}

/**
 * Main funciton
 * @param {number} times
 * @returns {any}
 */
function stuInit(times) {
    if (times === undefined) times = 1;
    if (times > 3) return;
    if (!isValid) return setTimeout(() => { stuInit(times + 1) }, 3000);
    document.dispatchEvent(new CustomEvent('nhtcss.buttonInit'));
    document.dispatchEvent(new CustomEvent('nhtcss.init'));
    initModal();
    removePremiumBanner();
}

function onLocationChange() {
    if (isValid()) initModal()
    else hideModal()
}

function onPageBgImgChange(mode) {
    if (!mode) mode = currentPageBgMode;
    currentPageBgMode = mode;
    document.querySelectorAll('.pageBgImg').forEach(btn => btn.classList.remove('active'))
    document.querySelector(`.pageBgImg[data-page-bg="${mode}"]`).classList.add('active');
    document.body.classList.remove('remove-page-bg-auto', 'remove-page-bg');
    switch (mode) {
        case 'auto':
            document.body.classList.add('remove-page-bg-auto');
            break;
        case 'hide':
            document.body.classList.add('remove-page-bg');
        case 'show':
            /* do nothing */
            break;
    }
}

function initModal() {
    const m = document.querySelector('.nht_modal-content');
    if (!m) return;
    if (isInit) return showModal();
    m.innerHTML = `
        <div class="d-flex-center mb-8-px">
            <h3 class="fw=500">Page Background</h3>
        </div>
        <div class="d-flex-center">
            <button class="ms-8-px pageBgImg btn-page-bg" data-page-bg="auto">Auto</button>
            <button class="ms-15-px pageBgImg btn-page-bg" data-page-bg="hide">Remove</button>
            <button class="ms-15-px me-8-px pageBgImg btn-page-bg" data-page-bg="show">Show</button>
        </div>`;
    showModal();
    onPageBgImgChange();
    isInit = true;
}


function hideModal() {
    document.querySelector('nht').classList.add('d-none-important');
}

function showModal() {
    document.querySelector('nht').classList.remove('d-none-important');
}

function removePremiumBanner() {
    try {
        // query class has prefix "ViewerContainer_premium-banner-wrapper"
        const banner = document.querySelector('[class^="ViewerContainer_premium-banner-wrapper"]');
        if (banner) {
            // find float wrapper "FloatingComponentsWrapper*"
            banner.closest('[class^="FloatingComponentsWrapper"]').remove();
        }
    } catch (error) {
        console.error('Error removing premium banner:', error);
        alert('Error removing premium banner: ' + error.message);
    }
}

function removeBlurFilter() {
    try {
        document.querySelectorAll('[class^="PremiumPageClarificationBanner_container"]').forEach(el => {
            try {
                el.remove();
            } catch (error) {
                console.error('Error removing premium clarification banner:', error);
            }
        });
        document.querySelectorAll('[class^="DocumentPage_blurred-image-wrapper"]').forEach(el => {
            try {
                el.style.filter = 'none';
                el.style.webkitFilter = 'none';
                el.style.backdropFilter = 'none';
                el.style.userSelect = 'text';
            } catch (error) {
                console.error('Error removing blur filter from an element:', error);
            }
        })
    } catch (error) {
        console.error('Error removing blur filter:', error);
        alert('Error removing blur filter: ' + error.message);
    }
}


var currentPageBgMode = 'auto'
var isInit = false;
run()
function run() {
    document.dispatchEvent(new CustomEvent('nhtcss.matchWithDarkReader'));
    stuInit();
    onLocationChange();
    setTimeout(onLocationChange, 3000);
    setInterval(onLocationChange, 20000);
    document.addEventListener(new CustomEvent('location.change'), onLocationChange);
    document.querySelectorAll('.pageBgImg').forEach(btn => {
        btn.addEventListener('click', e => {
            const mode = e.target.getAttribute('data-page-bg');
            onPageBgImgChange(mode);
        })
    });
}