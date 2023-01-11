const findSurvey = () => {
    if (!window.location.href.match(/\/sinh-vien\/khao-sat/)) return
    const a = document.querySelector('a[href*="/sinh-vien/chi-tiet-phieu-khao-sat"]')
    if (!a) return
    a.dispatchEvent(new PointerEvent('click', { bubbles: true }))
}

const autoCompleteForm = () => {
    let anySuccess = false
    try {
        document.querySelectorAll('.group_cauhoi .group-cautraloi').forEach(div => {
            const $inputs = div.querySelectorAll('input')
            if ($inputs && $inputs.length) {
                $inputs[ 3 ].checked = true
                anySuccess = true
            }
        })
        document.querySelectorAll('.input-ykien').forEach(yk => {
            yk.value = 'Không có'
            anySuccess = true
        })
        if (anySuccess) {
            document.querySelector('input[type="submit"]').dispatchEvent(new PointerEvent('click', { bubbles: true }))
        }
    } catch (e) { }
}

const main = () => {
    setTimeout(findSurvey, 2000);
    setTimeout(autoCompleteForm, 4000);
}
main();
document.addEventListener('location.change', main);