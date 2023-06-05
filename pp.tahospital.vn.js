
// Expand all info
if (window.location.href.includes('pp.tahospital.vn/info')) {
    const timelineTitle = document.querySelector('h6.col-md-12');
    if (timelineTitle) {
        const expandBtn = document.createElement('button');
        expandBtn.innerText = 'Hiển thị tất cả';
        expandBtn.classList.add('ml-3', 'btn', 'btn-sm', 'btn-primary');
        expandBtn.setAttribute('onclick', `
function expandAll() {
    const collapsed = $('.collapsed-card')
    if (!collapsed.length) return $('.tab-content .tab-pane').addClass('active show')
    $('.collapsed-card [data-card-widget=collapse]').trigger('click')
    setTimeout(expandAll, 3000)
    console.log('expanding...')
}
expandAll()`)
        timelineTitle.appendChild(expandBtn);
    }
}