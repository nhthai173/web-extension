function copyButtonInit() {
    const copied_notify = document.createElement('div')
    copied_notify.id = 'copied_notify'
    copied_notify.style.width = 'fit-content'
    copied_notify.style.height = 'fit-content'
    copied_notify.style.position = 'absolute'
    copied_notify.style.bottom = '20px'
    copied_notify.style.left = '50%'
    copied_notify.style.transform = 'translateX(-50%)'
    copied_notify.style.padding = '10px 20px'
    copied_notify.style.backgroundColor = 'rgba(0,0,0,.8)'
    copied_notify.style.color = '#fff'
    copied_notify.style.borderRadius = '5px'
    copied_notify.style.fontSize = '18px'
    copied_notify.style.fontWeight = 'bold'
    copied_notify.style.zIndex = '99999999999999999'
    copied_notify.style.opacity = '0'
    copied_notify.style.transition = 'all .3s ease'
    copied_notify.innerHTML = 'Copied!'
    document.body.prepend(copied_notify)

    const btn_id = document.createElement('button')
    btn_id.id = 'file_btn_id'
    btn_id.className = 'glX3de frsiVb  EwXqJf  bqihDe bFbM5e  Ss7qXc  Ss7qXc'
    btn_id.style.position = 'absolute'
    btn_id.style.top = '7px'
    btn_id.style.right = '26px'
    btn_id.style.width = '30px'
    btn_id.style.height = '25px'
    btn_id.style.zIndex = '99999999999999999'
    btn_id.innerHTML = 'ID'
    btn_id.addEventListener('click', (e) => {
        e.preventDefault()
        navigator.clipboard.writeText(btn_id.getAttribute('data-id'))
        copied_notify.style.opacity = '1'
        setTimeout(() => {
            copied_notify.style.opacity = '0'
        }, 1000);
    })

    const btn_url = document.createElement('button')
    btn_url.className = 'glX3de frsiVb  EwXqJf  bqihDe bFbM5e  Ss7qXc  Ss7qXc'
    btn_url.style.position = 'absolute'
    btn_url.style.top = '7px'
    btn_url.style.right = '65px'
    btn_url.style.width = '40px'
    btn_url.style.height = '25px'
    btn_url.style.zIndex = '99999999999999999'
    btn_url.innerHTML = 'URL'
    btn_url.addEventListener('click', (e) => {
        e.preventDefault()
        const id = document.getElementById('file_btn_id').getAttribute('data-id')
        navigator.clipboard.writeText(`https://drive.google.com/open?id=${id}`)
        copied_notify.style.opacity = '1'
        setTimeout(() => {
            copied_notify.style.opacity = '0'
        }, 1000);
    })
    document.querySelector('.uEnUtd').prepend(btn_id)
    document.querySelector('.uEnUtd').prepend(btn_url)

    document.querySelectorAll('[data-target="doc"]').forEach((file) => {
        file.addEventListener('click', (e) => {
            const fileId = file.getAttribute('data-id')
            document.getElementById('file_btn_id').setAttribute('data-id', fileId)
        })
    })

}


setInterval(() => {
    if (!document.getElementById('file_btn_id')) {
        copyButtonInit()
    }
}, 1000);