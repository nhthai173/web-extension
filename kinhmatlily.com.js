
const div = document.createElement('div');
div.className = 'nht-download';
div.style.position = 'fixed';
div.style.top = '10px';
div.style.left = '10px';
div.innerHTML = `<button id="nht-json-download">Download JSON</button>`;
document.body.appendChild(div);
div.addEventListener('click', () => {
    const json = document.getElementById('__NEXT_DATA__').innerHTML
    console.log(json)
    const page = JSON.parse(json).props.pageProps.pagging.current

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    download(`data-${page}.json`, json)
});