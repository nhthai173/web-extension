const URL_PARAMS = () => {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
}

const Descriptions = {}
const TimerDisplay = {
    start: 0,
    text: function () {
        const start = this.start
        if (start !== 0) {
            const curr = Math.floor(new Date().getTime() / 1000)
            const gap = curr - start
            let h = Math.floor(gap / 3600)
            let m = Math.floor((gap - h * 3600) / 60)
            let s = gap - h * 3600 - m * 60
            if (h < 10) h = '0' + h
            if (m < 10) m = '0' + m
            if (s < 10) s = '0' + s
            return `${h}:${m}:${s}`
        }
        return '00:00:00'
    }
}

const Toggl = {

    ws: new WebSocket('ws://localhost:173/toggl'),
    init: function() {
        this.ws.onmessage = function(msg) {
            if (!this.onmessage) {
                console.log('Receive from WebSocket', msg)
                return
            }
            try {
                this.onmessage()
            } catch (e) {}
        }
    },

    _wsSendMsg: function(msg, times = 0) {
        return new Promise((resolve, reject) => {
            function _send() {
                if (!this.ws || this.ws.readyState !== 1) {
                    return false
                }
                this.ws.send(msg)
                return true
            }
            function _check() {
                console.log(times)
                times++
                const r = _send() || times > 7
                if (r) resolve()
                return r
            }
            if (!_check()) setTimeout(_check, 50)
            if (times >= 7) {
                console.error('WebSocket connection failed')
                reject('WebSocket connection failed')
            }
        })
    },

    startTimeEntry: function(description = '', tag = []) {
        if (tag && typeof tag == 'string') {
            tag = [ tag ]
        }
        return this._wsSendMsg(JSON.stringify({ method: 'START_TIME', description, tag }))
    },
};
Toggl.init();

/**
 * Get page/database title
 * @param {HTMLElement} el 
 * @param {string} blockId 
 * @param {number} type 0: page, 1: database. Default is 0
 * @returns 
 */
const getTitle = (el, blockId, type = 0) => {
    const blockClass = [
        '.notion-page-block',
        '.notion-collection_view-block',
    ]
    if (el && blockId && blockClass[ type ]) {
        const blocks = el.querySelectorAll(blockClass[ type ])
        if (blocks.length) {
            for (const p of blocks) {
                const blockId = p.getAttribute('data-block-id').replace(/-/g, '')
                const text = p.textContent
                if (blockId === blockId && text) {
                    return text
                }
            }
        }
    }
    return ''
}


// Get page/databse info {type, id, name, togglTag}
function getInfo() {
    const url = location.pathname
    const pParam = URL_PARAMS().p
    let info = { type: 'page', id: '', name: '' }

    // Get id and type
    if (pParam) {
        info.id = pParam
    } else if (url.includes('-')) {
        info.id = url.split('-').at(-1)
    } else if (location.hostname == 'www.notion.so') {
        const paths = url.split('/')
        if (paths[ 2 ]) {
            info.type = 'database'
            info.id = paths[ 2 ]
        }
    }

    // Get name
    if (info.type == 'database') {
        info.name = getTitle(document.querySelector('.notion-frame'), info.id, 1)
    } else {
        info.name = getTitle(document.querySelector('.notion-peek-renderer'), info.id)
        if (!info.name) {
            info.name = getTitle(document.querySelector('.notion-frame'), info.id)
        }
    }
    info.name = info.name || document.title
    info.togglTag = info.id ? `notion${shortUUID(info.id)}` : ''

    return info
}


/**
 * 
 * @param {string} uuid 
 */
function shortUUID(uuid = '') {
    const enc = new TextEncoder().encode(uuid)
    const num = enc.reduce((v, i) => v * 32 + i, 0)
    return num.toString(32).replace(/[0-5]/g, '')
}



function showModal() {
    emptyModal()

    const info = getInfo()
    const $modal = document.querySelector('.nht_modal')
    const el = document.createElement('div')
    el.className = 'nht_page-info'
    el.innerHTML = `
            <div class="nht_card w-100 mt-15-px bg-auto">
                <div class="nht_2-side mb-15-px">
                    <div class="ttl">
                        <span class="text-auto bold">Title:</span>
                    </div>
                    <div>
                        <span class="text-muted">${info.name}</span>
                    </div>
                </div>
                <div class="nht_2-side mb-15-px">
                    <div class="ttl">
                        <span class="text-auto bold">Type:</span>
                    </div>
                    <div>
                        <span class="text-muted">${info.type}</span>
                    </div>
                </div>
                <div class="nht_2-side mb-15-px">
                    <div class="ttl">
                        <span class="text-auto bold">ID:</span>
                    </div>
                    <div>
                        <a href="javascript:void(0)" class="underline nht_btn-copy text-overflow text-muted" data-copy="${info.id}">${info.id}</a>
                    </div>
                </div>
                <div class="nht_2-side">
                    <div class="ttl">
                        <span class="text-auto bold">Toggl tag:</span>
                    </div>
                    <div>
                        <a href="javascript:void(0)" class="underline nht_btn-copy text-overflow text-muted" data-copy="${info.togglTag}">${info.togglTag}</a>
                    </div>
                </div>
            </div>


            <div class="nht_card w-100 bg-auto mb-4-px">
                <div class="nht_2-side" style="height: 28px">
                    <div>
                        <span class="nht_title-sm bold text-toggl">Time Tracker</span>
                    </div>
                    <div>
                        <span class="text-auto" id="current_timer">00:00:00</span>
                    </div>
                </div>

                <div class="toggl-form-content"></div>

            </div>
            <!--
            <div class="nht_card w-100 bg-auto">
                <div class="d-flex-center mt-4-px mb-8-px">
                    <div class="nht_icon no-data"></div>
                </div>
                <div class="d-flex-center">
                    <span class="text-muted">No Data</span>
                </div>
            </div>
            -->
            <!--
            <div class="nht_card w-100 bg-auto">
                <div class="nht_2-side text-auto">
                    <div class="bold">Total</div>
                    <div>01:34:55</div>
                </div>
                <div class="hr hr-sm muted"></div>
                <div class="nht_2-side text-muted">
                    <div>00:32:58</div>
                    <div>14/10/2022 21:35:40</div>
                </div>
                <div class="hr hr-sm muted"></div>
                <div class="nht_2-side text-muted">
                    <div>00:32:58</div>
                    <div>14/10/2022 21:35:40</div>
                </div>
                <div class="hr hr-sm muted"></div>
                <div class="nht_2-side text-muted">
                    <div>00:32:58</div>
                    <div>14/10/2022 21:35:40</div>
                </div>
                <div class="hr hr-sm muted"></div>
                <div class="d-flex-center">
                    <span class="underline pointer text-muted">View all</span>
                </div>
            </div>
            -->
        `
    $modal.querySelector('.nht_modal-content').appendChild(el)
    document.dispatchEvent(new Event('nhtcss.init'))
    loadTogglInfo()
}

function emptyModal() {
    document.querySelector('.nht_modal-content').innerHTML = ''
}

// Render Toggl to modal
async function loadTogglInfo(taskInfo = {}) {
    const copyEvents = [
        'copy',
        'cut',
        'contextmenu',
        'selectstart',
        'mousedown',
        'mouseup',
        'mousemove',
        'keydown',
        'keypress',
        'keyup',
    ]
    const rejectOtherHandlers = (e) => {
        e.stopPropagation()
        if (e.stopImmediatePropagation) e.stopImmediatePropagation()
    }

    // Get current page/database detail
    if (Object.keys(taskInfo).length === 0) {
        taskInfo = getInfo()
    }

    // const currentTrack = await toggl.getCurrentTimeEntry()
    const currentTrack = null
    const isTracking = currentTrack && currentTrack.tags && currentTrack.tags.includes(taskInfo.togglTag)
    const trackDescription = isTracking ? currentTrack.description : (Descriptions[ taskInfo.togglTag ] || taskInfo.name)
    const el = document.querySelector('.toggl-form-content')


    if (!isTracking) {
        const form = document.createElement('div')
        form.innerHTML = `
            <div class="hr hr-sm muted"></div>
            <div class="nht_2-side mt-8-px">
                <span class="text-muted">Description</span>
            </div>
            <form class="d-flex-center mt-8-px" autocomplete="off" data-no-focus-lock="true">
                <textarea class="m-0-px description" id="nht_track_description" autocomplete="off">${trackDescription}</textarea>
            </form>
            <div class="d-flex-center mt-15-px">
                <span class="btn btn-toggl btn-loading">
                    Start Timer
                    <div class="line-loading"></div>
                </span>
            </div>`
        el.appendChild(form)
        const input = document.querySelector('#nht_track_description')
        copyEvents.forEach((evt) => {
            input.addEventListener(evt, rejectOtherHandlers, {
                capture: true,
            })
        })
        input.addEventListener('input', (e) => {
            Descriptions[ taskInfo.togglTag ] = e.target.value
        })
        form.querySelector('.btn-toggl').addEventListener('click', async(e) => {
            e.target.classList.add('loading')
            const description = form.querySelector('.description').value
            // toggl.startTimeEntry({
            //     description,
            //     workspace_id: 6482073,
            //     tags: [ taskInfo.togglTag ]
            // }).then(entry => {
            //     // buttonLoading(e.target, false)
            //     loadTogglInfo()
            // })

            // ============== //
            // wsSendMsg(JSON.stringify({ method: 'START_TIME', description, tag: taskInfo.togglTag }))

            Toggl.startTimeEntry(description, taskInfo.togglTag)
                .then(() => e.target.classList.remove('loading'))
                .catch(() => e.target.classList.remove('loading'))
            
        })
    } else {
        const form = document.createElement('div')
        form.innerHTML = `
            <div class="hr hr-sm muted"></div>
            <div class="nht_2-side mt-8-px">
                <span class="text-muted">Description</span>
            </div>
            <form class="d-flex-center mt-8-px" autocomplete="off" data-no-focus-lock="true" disabled>
                <textarea class="m-0-px description" id="nht_track_description" autocomplete="off" disabled>${trackDescription}</textarea>
            </form>
            <div class="d-flex-center mt-15-px">
                <span class="btn">Stop Timer</span>
            </div>`
        setInterval(() => {
            let start = currentTrack.duration
            if (start) start *= -1
            TimerDisplay.start = start || 0
            document.querySelector('#current_timer').innerText = TimerDisplay.text()
        }, 1000)
    }


}



run()
function run() {
    document.documentElement.style.setProperty('--loading-color', '#cf75cc')

    document.dispatchEvent(new CustomEvent('nhtcss.buttonInit'))

    document.addEventListener('nhtcss.modal.show', showModal)
    document.addEventListener('nhtcss.modal.hide', emptyModal)

}