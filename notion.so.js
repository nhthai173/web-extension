const URL_PARAMS = () => {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
}



const TogglTrack = (token = '') => {
    const baseUrl = 'https://api.track.toggl.com/api'

    const auth = () => {
        if (token) {
            return {
                'Authorization': 'Basic ' + Buffer.from(token + ':api_token', 'utf8').toString('base64'),
            }
        }
        return null
    }

    const url = (path = '') => {
        return baseUrl + path
    }

    const _fetch = async (url, options) => {
        let opt = {}
        if (Object.keys(options).length) {
            opt = { ...options }
        }
        if (auth()) {
            if (opt.headers) {
                opt.headers = { ...opt.headers, ...auth() }
            } else {
                opt.headers = auth()
            }
            if (url) {
                return await fetch(url, opt)
                    .then(res => {
                        if (!res.ok) {
                            let errText = res.status + ' ' + res.statusText
                            return res.text().then(text => {
                                throw new Error(errText + '\n' + text)
                            })
                        }
                        else {
                            return res.json();
                        }
                    })
                    .catch(err => {
                        console.log('caught it!', err);
                    });
            }
        }
        return null
    }

    /**
     * 
     * @param {Object} options {"start_date": yyyy-mm-dd, "end_date": yyyy-mm-dd}
     * 
     * Docs: https://developers.track.toggl.com/docs/api/time_entries/index.html
     */
    const getTimeEntries = async (options = {}) => {
        let { start_date, end_date } = options
        start_date = start_date || '2022-07-18'
        end_date = end_date || new Date(new Date().getTime() + 24 * 3600000).toISOString().split('T')[ 0 ]
        if (start_date && end_date) {
            return await _fetch(url(`/v9/me/time_entries?start_date=${start_date}&end_date=${end_date}`), {
                method: "GET"
            })
        }
        return []
    }

    const getCurrentTimeEntry = async () => {
        return await _fetch(url(`/v9/me/time_entries/current`), {
            method: "GET"
        })
    }

    /**
     * 
     */
    const startTimeEntry = async (options = {}) => {
        const { description, workspace_id, tags } = options
        const time = new Date()
        if (workspace_id) {
            return await _fetch(url('/v9/time_entries'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "created_with": "nht_bot",
                    "description": description || '',
                    "tags": tags || [],
                    "billable": false,
                    "start": time.toISOString(),
                    "wid": workspace_id,
                    "duration": -1 * Math.floor(time.getTime() / 1000)
                })
            })
        }

        return await _fetch(url('/v8/time_entries/start'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "time_entry": {
                    "created_with": "nht_bot",
                    "description": description || '',
                    "tags": tags || [],
                    "billable": false,
                }
            })
        })

    }

    /**
     * 
     */
    const stopTimeEntry = async (workspace_id = '') => {
        let startedTime = 0
        let time_entry_id = ''
        const time = new Date()
        const curr = await getCurrentTimeEntry()
        if (curr && curr.id) {
            time_entry_id = curr.id
            startedTime = -1 * curr.duration
        }
        if (time_entry_id) {
            if (workspace_id) {
                return await _fetch(url(`/v9/workspaces/${workspace_id}/time_entries/${time_entry_id}`), {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "stop": time.toISOString(),
                        "duration": Math.floor(time.getTime() / 1000) - startedTime
                    })
                })
            }

            return await _fetch(url(`/v8/time_entries/${time_entry_id}/stop`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            })

        }
        return null
    }

    const TogglTrack = () => {
        return {
            getTimeEntries,
            getCurrentTimeEntry,
            startTimeEntry,
            stopTimeEntry
        }
    }
    return TogglTrack()

}
const toggl = TogglTrack('2dcf511405f3750c754336711bd749d9')


/**
 * 
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
            <div class="nht_card w-100 mt-15 bg-auto">
                <div class="nht_2-side mb-15">
                    <div class="ttl">
                        <span class="text-auto bold">Title:</span>
                    </div>
                    <div>
                        <span class="text-muted">${info.name}</span>
                    </div>
                </div>
                <div class="nht_2-side mb-15">
                    <div class="ttl">
                        <span class="text-auto bold">Type:</span>
                    </div>
                    <div>
                        <span class="text-muted">${info.type}</span>
                    </div>
                </div>
                <div class="nht_2-side mb-15">
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


            <div class="nht_card w-100 bg-auto mb-4">
                <div class="nht_2-side" style="height: 28px">
                    <div>
                        <span class="nht_title-sm bold text-toggl">Time Tracker</span>
                    </div>
                    <div>
                        <span class="text-auto">00:00:00</span>
                    </div>
                </div>

                <div class="start-prompt">
                    <div class="hr hr-sm muted"></div>
                    <div class="nht_2-side mt-8">
                        <span class="text-muted">Description</span>
                    </div>
                    <form class="d-flex-center mt-8" autocomplete="off" data-no-focus-lock="true">
                        <textarea class="m-0 description" id="nht_track_description" autocomplete="off">${info.name}</textarea>
                    </form>
                    <div class="d-flex-center mt-15">
                        <span class="btn btn-toggl">Start Timer</span>
                    </div>
                </div>
            </div>
            <!--
            <div class="nht_card w-100 bg-auto">
                <div class="d-flex-center mt-4 mb-8">
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
    descriptionForm()
}

function emptyModal() {
    document.querySelector('.nht_modal-content').innerHTML = ''
}


function descriptionForm() {
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
    const input = document.querySelector('#nht_track_description')
    if(input){
        copyEvents.forEach((evt) => {
            input.addEventListener(evt, rejectOtherHandlers, {
                capture: true,
            })
        })
    }
}



run()
function run() {
    document.dispatchEvent(new CustomEvent('nhtcss.buttonInit'))

    document.addEventListener('nhtcss.modal.show', showModal)
    document.addEventListener('nhtcss.modal.hide', emptyModal)

    // const script = document.createElement('script')
    // script.src = '/Users/thainguyen/Documents/web-extension/api.toggl.js'
    // script.type = 'text/javascript'
    // document.head.appendChild(script)

}