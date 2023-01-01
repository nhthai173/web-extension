const autoCompleteForm = () => {
    try {
        document.querySelectorAll('.group_cauhoi .group-cautraloi').forEach(div => {
            const $inputs = div.querySelectorAll('input')
            if ($inputs && $inputs.length) {
                $inputs[ 3 ].checked = true
            }
        })
        document.querySelectorAll('.input-ykien').forEach(yk => {
            yk.value = 'Không có'
        })
        document.querySelector('input[type="submit"]').dispatchEvent(new PointerEvent('click', { bubbles: true }))
    } catch (e) { }
}


document.addEventListener('location.change', autoCompleteForm)
setTimeout(autoCompleteForm, 2000);