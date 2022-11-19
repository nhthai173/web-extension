var url = window.location.href

// for script.google.com
if (url.includes('script.google.com') && url.includes('/exec')) {
    function removeWarning() {
        const w = document.getElementById('warning')
        if (w) w.innerHTML = ""
    }
    setInterval(removeWarning, 1000);
}