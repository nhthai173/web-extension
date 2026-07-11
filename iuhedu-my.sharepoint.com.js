function syncModeWithO365() {
    const $btnDarkMode = document.getElementById('DarkModeSwitch')
    if (!$btnDarkMode) return
    function _isDark() {
        const theme = $btnDarkMode.getAttribute('aria-checked')
        return theme === 'true' ? true : false
    }
    function themeChange() {
        if (_isDark()) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }
    new MutationObserver((mutations, observer) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-checked') {
                themeChange()
            }
        })
    }).observe($btnDarkMode, { attributes: true })
    themeChange()
}

function lazyInit() {
    document.dispatchEvent(new CustomEvent('nhtcss.init'));
}

function buttonInit() {
    if (document.querySelector('.nht_modal-content')) return;
    document.dispatchEvent(new CustomEvent('nhtcss.buttonMiniInit'));
    const $modalContent = document.querySelector('.nht_modal-content')
    if ($modalContent) {
        $modalContent.innerHTML = `
            <div class="d-flex-center">
                <button class="btn-blue">Dark PDF</button>
                <button class="ms-8-px btn-blue">Light PDF</button>
            </div>`;
        lazyInit();
    }
}

function showBtnWhenFoundPDF() {
    const el = document.querySelector('.od-PdfViewer-container .canvasWrapper canvas');
    if (!el) return document.dispatchEvent(new CustomEvent('nhtcss.buttonDestroy'));
    buttonInit();
}

setInterval(showBtnWhenFoundPDF, 1000);
setTimeout(syncModeWithO365, 3000);