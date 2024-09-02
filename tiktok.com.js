function customStyle() {

    // User mention
    document.querySelectorAll('[href*="/@"]').forEach(a => {
        if (a.className.includes('UserLinkContent')) {
            a.style.color = "var(--custom-primary-color)"
        }
    })

    // Icon
    document.querySelectorAll('svg').forEach(svg => {
        const colorVal = getComputedStyle(svg).getPropertyValue('fill')
        if (colorVal.includes('255, 59, 92')) {
            svg.style.fill = "var(--custom-primary-color)"
        }
    })

    // Span link
    document.querySelectorAll('span').forEach(span => {
        const colorVal = getComputedStyle(span).getPropertyValue('color')
        if (colorVal.includes('255, 59, 92')) {
            span.style.color = "var(--custom-primary-color)"
        }
    })

    // nyan cat progress bar
    document.querySelectorAll('[id^="one-column-item-"]').forEach(div => {
        const knobContainer = div.querySelector('[class*="DivVideoControlContainer"]')
        if (!knobContainer) return
        if (div.classList.contains('nyan-cat-progress-bar')) return
        div.classList.add('nyan-cat-progress-bar')
        const catKnob = document.createElement('div')
        catKnob.classList.add('nyan-cat-knob')
        knobContainer.append(catKnob)
        setInterval(() => {
            const p = Number(div.querySelector('[role="slider"]').getAttribute('aria-valuenow')) * 100
            catKnob.style.left = `calc(${p}% - 17px)`
        }, 5)
    })

}


setInterval(customStyle, 100);