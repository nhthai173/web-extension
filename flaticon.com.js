function svgToPngClipboard(svg, btn) {
    const width = parseInt(svg.getAttribute('width')) || 512
    const height = parseInt(svg.getAttribute('height')) || 512
    const svgData = new XMLSerializer().serializeToString(svg)
    const url = URL.createObjectURL(new Blob([ svgData ], { type: 'image/svg+xml;charset=utf-8' }))
    const img = new Image()
    img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(url)
        canvas.toBlob(blob => {
            navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ])
            if (btn) {
                btn.innerText = 'Copied!'
                setTimeout(() => { btn.innerText = 'Copy PNG' }, 1000)
            }
        }, 'image/png')
    }
    img.src = url
}

function flaticonCopyPngBtnInit() {
    const holder = document.querySelector('.detail__editor__icon-holder.icon-holder')
    if (!holder || document.getElementById('nht_flaticon_copy_png')) return

    if (getComputedStyle(holder).position === 'static') {
        holder.style.position = 'relative'
    }

    const btn = document.createElement('button')
    btn.id = 'nht_flaticon_copy_png'
    btn.type = 'button'
    btn.innerText = 'Copy PNG'
    btn.style.cssText = 'position:absolute;top:8px;right:8px;z-index:999;padding:6px 12px;border-radius:4px;border:none;background:#19acef;color:#fff;cursor:pointer;font-size:13px;font-weight:600;'
    btn.addEventListener('click', () => {
        const svg = holder.querySelector('svg')
        if (svg) svgToPngClipboard(svg, btn)
    })
    holder.appendChild(btn)
}

setInterval(flaticonCopyPngBtnInit, 1000)
