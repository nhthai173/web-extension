const customPage = () => {
    // Change video progress bar
    document.querySelectorAll('div[role="slider"] div[data-visualcompletion="ignore"]').forEach(el => {
        // prorgress
        if (el.hasChildNodes()) {
            el.classList.add('nyan-cat-progress')
            // thumb
            const div = el.querySelector('div')
            if (div) {
                div.classList.add('nyan-cat', 'fb-nyan-cat')
            }
        }
        // load
        else {
            el.classList.add('nyan-cat-load')
        }
    })
}


setInterval(customPage, 100);