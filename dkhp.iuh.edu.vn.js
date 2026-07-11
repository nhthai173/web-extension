/* ========= CONFIG ========= */
var STEP_BY_STEP = false;
var CURRENT_STEP = 0;
var STEPS = [
    {fn: selectTerm, args: [ 'HK2 (2023-2024)' ]},
];



/* ========= MAIN CODE ========= */

var INTERVAL_ID = setInterval(main, 1000);


function main() {
    if (STEP_BY_STEP) {
        if (CURRENT_STEP >= STEPS.length) return clearInterval(INTERVAL_ID);
        const isStepSuccess = STEPS[ CURRENT_STEP ].fn(...STEPS[ CURRENT_STEP ].args);
        if (isStepSuccess) {
            CURRENT_STEP++;
        }
    } else {
        if (selectTerm())
            clearInterval(INTERVAL_ID);
    }
}



/**
 * Return the term in the future as a string
 * @param {Date} date the date to be calculated
 * @param {number} offset number of terms to be added
 * @returns {string}
 */
function getDotDK(date, offset = 0) {
    const terms = [ 2, 3, 1 ]
    const yearOffset = [ -1, -1, 0 ]
    if (!date) date = new Date();
    const m = date.getMonth() + 1;
    let y = date.getFullYear();
    let tindex = m <= 4 ? 0 : (m <= 7 ? 1 : 2);
    const yoffset = Math.floor((tindex + offset) / 3);
    tindex = (tindex + offset) % 3;
    y += yoffset + yearOffset[ tindex ];
    return `HK${terms[ tindex ]} (${y}-${y + 1})`;
}


function selectTerm(dotdk = '') {
    if (!dotdk) {
        // Default to current term
        dotdk = getDotDK();
    }
    const $dotDK = document.querySelector('#ddk');
    if (!$dotDK) return false;
    const $dotDKOptions = [ ...$dotDK.querySelectorAll('option') ];
    const $dotDKOption = $dotDKOptions.find((it) => it.textContent.trim().includes(dotdk));
    $dotDK.value = $dotDKOption?.value;
    $dotDK.dispatchEvent(new Event('change', { bubbles: true }));

    const $tableMonHocCho = document.querySelector('table#monHocCho');
    if (!$tableMonHocCho) return false;
    if (!$tableMonHocCho.querySelectorAll('tbody tr').length) return false;
    return true;
}