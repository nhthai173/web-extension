import { TogglTrack } from "./api.toggl";


const URL_PARAMS = () => {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {string} blockId 
 * @param {number} type 0: page, 1: database. Default is 0
 * @returns 
 */
const getTitle = (el, blockId, type = 0) =>{
    const blockClass = [
        '.notion-page-block',
        '.notion-collection_view-block',
    ]
    if (el && blockId && blockClass[ type ]){
        const blocks = el.querySelectorAll(blockClass[type])
        if(blocks.length){
            for(const p of blocks){
                const blockId = p.getAttribute('data-block-id').replace(/-/g, '')
                const text = p.textContent
                if (blockId === blockId && text){
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
    if(info.type == 'database'){
        info.name = getTitle(document.querySelector('.notion-frame'), info.id, 1)
    }else{
        info.name = getTitle(document.querySelector('.notion-peek-renderer'), info.id)
        if (!info.name) {
            info.name = getTitle(document.querySelector('.notion-frame'), info.id)
        }
    }
    info.name = info.name || document.title

    return info
}



function showModal(){
    emptyModal()
    
    const info = getInfo()
    const $modal = document.querySelector('.nht_modal')
    const el = document.createElement('div')
    el.className = 'nht_page-info'
    el.innerHTML = `
            <div class="nht_card w-100 bg-auto">
                <div class="nht_2-side mb-15">
                    <div>
                        <span class="text-auto bold">Title:</span>
                    </div>
                    <div>
                        <span class="text-muted">${info.name}</span>
                    </div>
                </div>
                <div class="nht_2-side mb-15">
                    <div>
                        <span class="text-auto bold">Type:</span>
                    </div>
                    <div>
                        <span class="text-muted">${info.type}</span>
                    </div>
                </div>
                <div class="nht_2-side">
                    <div style="width: 70%;">
                        <span class="text-auto bold">ID:</span>
                    </div>
                    <div>
                        <a href="javascript:void(0)" class="underline nht_btn-copy text-overflow text-muted" data-copy="${info.id}">${info.id}</a>
                    </div>
                </div>
            </div>

            <div class="nht_card w-100 bg-auto mb-4">
                <div class="nht_2-side" style="height: 28px">
                    <div>
                        <span class="nht_title-sm bold">Time Tracker</span>
                    </div>
                    <div>
                        <span class="text-auto underline pointer">Start timer</span>
                    </div>
                </div>
            </div>
            <div class="nht_card w-100 bg-auto mb-0">
                <div class="d-flex-center mt-4 mb-8">
                    <div class="nht_icon no-data"></div>
                </div>
                <div class="d-flex-center">
                    <span class="text-muted">No Data</span>
                </div>
            </div>
        `


    // `
    //         <div class="nht_2-side text-auto">
    //             <div class="bold">Total</div>
    //             <div>01:34:55</div>
    //         </div>
    //         <div class="hr hr-sm muted"></div>
    //         <div class="nht_2-side text-muted">
    //             <div>00:32:58</div>
    //             <div>14/10/2022 21:35:40</div>
    //         </div>
    //         <div class="hr hr-sm muted"></div>
    //         <div class="nht_2-side text-muted">
    //             <div>00:32:58</div>
    //             <div>14/10/2022 21:35:40</div>
    //         </div>
    //         <div class="hr hr-sm muted"></div>
    //         <div class="nht_2-side text-muted">
    //             <div>00:32:58</div>
    //             <div>14/10/2022 21:35:40</div>
    //         </div>
    //         <div class="hr hr-sm muted"></div>
    //         <div class="d-flex-center">
    //             <span class="underline pointer text-muted">View all</span>
    //         </div>
    // `


    $modal.querySelector('.nht_modal-content').appendChild(el)
    document.dispatchEvent(new Event('nhtcss.init'))
}

function emptyModal(){
    document.querySelector('.nht_modal-content').innerHTML = ''
}



run()
function run() {
    document.addEventListener('nhtcss.modal.show', showModal)
    document.addEventListener('nhtcss.modal.hide', emptyModal)
}


new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/gh/hoangtran0410/notion-hack-toolkit/dist/nht.min.js'

})

(async()=>{
    TogglTrack('2dcf511405f3750c754336711bd749d9')
    const current = await toggl.getCurrentTimeEntry()
    console.log(current)
})()