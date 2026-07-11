


var URLParams = new URLSearchParams(window.location.search);

setTimeout(main, 1000);
setInterval(removeAds, 1000);

function main() {
    /* if (window.location.href.includes("/user")) { */
        addExpressModeButton();
        const $domainSelect = document.querySelector('[name=domain]')
        $domainSelect.style.display = ''
        $domainSelect.style.width = '100px'
        $domainSelect.parentNode.querySelector('.chosen-container').style.display = 'none'
        /* if (URLParams.get("express")) */
            expressMode();
    /* } */
}

function removeAds() {
    document.querySelectorAll(".adsbygoogle").forEach(d => d.remove());
    document.querySelectorAll("iframe[src*=googleads]").forEach(d => d.remove());
}

function addExpressModeButton() {
    const $btn = document.createElement('button')
    $btn.className = 'btn btn-primary btn-expressmode'
    $btn.innerHTML = 'Express Mode'
    document.querySelector('.navbar-brand').appendChild($btn)
    document.querySelector('.navbar-brand').href = "#"
    $btn.addEventListener('click', () => {
        expressMode()
    })
}

function expressMode() {
    const $div = document.createElement('div')
    $div.className = 'container-fluid expressmode-container'
    $div.innerHTML = `
        <div class="expressmode">
            <div class="nht_2-side mb-15-px">
                <h3>Express Mode</h3>
                <button class="ms-auto btn btn-secondary btn-close-expressmode">Close</button>
            </div>
            <div class="nht_form-label">
                <input type="url" class="nht_form-input input-url">
                <label>URL</label>
            </div>
            <div class="nht_form-label">
                <input type="text" class="nht_form-input input-custom">
                <label>ID</label>
                <span class="prefix">https://g2.by/</span>
            </div>
            <div class="nht_form-label">
                <input type="text" class="nht_form-input input-expiry" placeholder="MM/DD/YYYY">
                <label>Expiry Date (MM/DD/YYYY)</label>
            </div>
            <div class="nht_2-side mb-15-px">
                <div class="d-flex-center">
                    <button class="btn-customdate" data-customdate="0">Today</button>
                    <button class="btn-customdate" data-customdate="1">1 day</button>
                    <button class="btn-customdate" data-customdate="7">1 week</button>
                    <button class="btn-customdate" data-customdate="30">1 month</button>
                    <button class="btn-customdate" data-customdate="90">3 months</button>
                    <button class="btn-customdate" data-customdate="180">6 months</button>
                    <button class="btn-customdate" data-customdate="365">1 year</button>
                </div>
                <div></div>
            </div>
            <div class="d-flex-center mt-15-px mb-15-px">
                <button class="btn btn-primary btn-submit-expressmode" onclick="setTimeout(()=>{$('#shortenurl').submit()}, 1000)">Submit</button>
            </div>
        </div>
    `
    document.body.appendChild($div)
    document.querySelector('.btn-close-expressmode').addEventListener('click', () => {
        exitExpressMode()
    })
    document.querySelector('.btn-submit-expressmode').addEventListener('click', () => {
        expressModeSubmit()
    })
    document.querySelectorAll('.btn-customdate').forEach(d => {
        d.addEventListener('click', () => {
            const _2d = (n) => n < 10 ? `0${n}` : n;
            const _fm = (dt) => `${_2d(dt.getMonth() + 1)}/${_2d(dt.getDate())}/${dt.getFullYear()}`;
            const today = new Date().getTime();
            document.querySelector('.input-expiry').value = _fm(new Date(today + Number(d.getAttribute('data-customdate')) * 24 * 60 * 60 * 1000));
        })
    })
    document.dispatchEvent(new CustomEvent('nhtFormInit'))

    document.body.classList.add('overflow-none')
}

function exitExpressMode() {
    document.querySelector('.expressmode-container').remove()
    document.body.classList.remove('overflow-none')
}

function expressModeSubmit() {
    const set = {
        url: '',
        domain: 'https://g2.by',
        custom: '',
        expiry: ''
    }
    document.getElementById('hide-advande').dispatchEvent(new Event('click', { bubbles: true }))
    const $form = document.getElementById('main-form');
    setTimeout(() => {
        for (const i in set) {
            const $input = $form.querySelector(`[name=${i}]`)
            if (!$input) continue
            if (set[ i ])
                $input.value = set[ i ]
            else
                $input.value = document.querySelector(`.input-${i}`).value || ''
            $input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        exitExpressMode()
    }, 800);
}