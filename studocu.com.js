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
}

function onLocationChange() {
    if (isValid()) initModal()
    else hideModal()
}

function onPageBgImgChange(mode) {
    if (!mode) mode = 'auto';
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
    m.innerHTML = `
        <div class="d-flex-center mb-8">
            <h3 class="fw=500">Page Background</h3>
        </div>
        <div class="d-flex-center">
            <button class="ms-8 pageBgImg btn-page-bg" data-page-bg="auto">Auto</button>
            <button class="ms-15 pageBgImg btn-page-bg" data-page-bg="hide">Remove</button>
            <button class="ms-15 me-8 pageBgImg btn-page-bg" data-page-bg="show">Show</button>
        </div>`;
    document.querySelector('nht').classList.remove('d-none-important');
}


function hideModal() {
    document.querySelector('nht').classList.add('d-none-important');
}


var currentPageBgMode = 'auto'
run()
function run() {
    document.dispatchEvent(new CustomEvent('nhtcss.matchWithDarkReader'));
    stuInit();
    onLocationChange();
    onPageBgImgChange();
    document.addEventListener(new CustomEvent('location.change'), onLocationChange);
}

document.querySelectorAll('.pageBgImg').forEach(btn => {
    btn.addEventListener('click', e => {
        const mode = e.target.getAttribute('data-page-bg');
        onPageBgImgChange(mode);
    })
})

/* document.addEventListener('nhtcss.modal.show', e => {}); */