console.log('Started at:', getTime())

function getTime() {
    return new Date().toLocaleString('vi')
}

// export function 
function TogglTrack (token = '', default_start_date = '') {
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

    const _fetch = async(url, options) => {
        let opt = {}
        if (Object.keys(options).length) {
            opt = { ...options }
        }
        if(auth()){
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
        start_date = start_date || default_start_date
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
        const { description, workspace_id, tags} = options
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
        if(time_entry_id){
            if(workspace_id){
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

(async () => {
    const toggl = TogglTrack('2dcf511405f3750c754336711bd749d9', '2022-07-19')
    // const time = await toggl.getTimeEntries()
    // const startTimer = await toggl.startTimeEntry({
    //     description: 'nht_test_js',
    //     workspace_id: 6482073,
    //     tags: ['DevTest']
    // })
    // const current = await toggl.getCurrentTimeEntry()
    const stopTimer = await toggl.stopTimeEntry(6482073)

    console.log(getTime())
    console.log(stopTimer)
})()