var monDangKy = `
CE005.O11.MTCL
CE224.O11.MTCL.1
DS102.O12.CNCL.1
`;

setTimeout(() => {

    DangKy(monDangKy);

}, 1000);





/* ================= Main Code ================= */

function errorLog(msg) {
    if (!msg) msg = 'Không tìm thấy danh sách lớp học phần! Bạn tự chọn lớp đi nhé!'
    console.error(msg)
    alert(msg)
}

function DangKy(monDangKyString) {
    try {
        let listMonDangKy = monDangKyString.trim().split('\n').map((it) => it.trim())
        let allRows = [ ...document.querySelector('table')?.querySelectorAll('tr') ]
        if (!allRows) {
            return errorLog()
        }
        allRows = allRows.filter((row) => {
            const code = row.querySelector('td:nth-child(2)')?.textContent?.trim()
            return code && listMonDangKy.includes(code)
        })
        if (!allRows.length) {
            return errorLog()
        }
        allRows.forEach((row) => {
            const $input = row.querySelector('td:first-child input[type="checkbox"]')
            if (!$input) return
            $input.checked = true
            $input.dispatchEvent(new Event('click', { bubbles: true }))
        })
    } catch (e) {
        console.error(e)
        errorLog()
    }
}