const clearIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<g><path d="M740.4,401.4c-46-25.4-92.5-49.9-139.1-74.2c-36.3-18.9-73.3-19.2-110-0.9c-22,11-38.8,27.5-50.4,49.9c116.5,62,232.2,123.6,348.7,185.6c2.2-5.1,4.4-9.3,6-13.7C816.7,491.3,794.5,431.2,740.4,401.4z"/><path d="M875.6,35.1c-9.2-12.8-21.9-20.4-37.2-23.8c-16.7-3.7-26.1,0.2-35,14.3c-53,84.6-106,169.2-159,253.8c-1.7,2.7-3.2,5.4-4.8,8.1c1,1.1,1.5,2,2.3,2.4c36.2,19.3,72.4,38.6,109.1,58.2c1.3-2.1,2-3.1,2.6-4.2c41.6-93.9,83.1-187.8,124.8-281.6C882.7,52.3,881.7,43.5,875.6,35.1z"/><path d="M754.3,597.7c7.1-18.1-1.8-38.5-19.9-45.6c-18-7.2-38.5,1.7-45.6,19.8c-3.7,9.4-80.7,208.2-18.2,347.6c-29.6-0.3-76.3-7.1-141.9-31.8c-12.2-38-20.9-97.3,5.7-166.9c0,0-63.7,72.8-74.3,137.5c-13.7-6.6-28-13.8-43-21.8c-15-8.1-28.9-16-42-23.8c48.1-44.6,73.5-137.9,73.5-137.9c-43.3,60.6-97.5,86.2-135.9,97c-57.1-41.1-88.6-76.3-105.1-100.6c150.8-25,273.9-199.1,279.7-207.4c11.1-15.9,7.2-37.9-8.7-48.9c-15.9-11.2-37.8-7.2-49,8.7c-1.4,1.9-137.8,193.7-271.7,179.5c-10.4-1.1-21,2.5-28.6,10c-7.5,7.5-11.3,17.9-10.2,28.5c1.3,12.4,19.5,125.3,264.8,256.9C522.1,972.6,615.5,990,672.6,990c44.3,0,66.9-10.4,71.7-13c9.4-4.9,16-13.8,18.1-24.3c2.1-10.4-0.7-21.2-7.5-29.4C668.7,819.5,753.5,599.9,754.3,597.7z"/></g>
</svg>`

const viewIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<g><path d="M461.2,84.6c0-21.7,17.4-39.2,39.3-39.2c21.7,0,39.3,17.4,39.3,39.2v78.6c0,21.7-17.4,39.2-39.3,39.2c-21.7,0-39.3-17.4-39.3-39.2V84.6z M241.9,228.6c15.3,15.3,15.4,40.1,0,55.5c-15.3,15.3-40.1,15.5-55.5,0l-55.6-55.6c-15.3-15.3-15.4-40.1,0-55.5c15.3-15.3,40.1-15.5,55.5,0L241.9,228.6z M814.7,173c15.3-15.3,40.1-15.4,55.5,0c15.3,15.3,15.5,40.1,0,55.5l-55.6,55.6c-15.3,15.3-40.1,15.4-55.5,0c-15.3-15.3-15.5-40.1,0-55.5L814.7,173z M828.5,820.6c36-28.4,68.8-58.8,97.9-89.2c17.6-18.4,30.3-33,37.4-41.8c35.2-39.5,35.3-105-2.1-146c0,0-17.6-20.9-35.3-39.3c-29.1-30.4-61.9-60.8-97.9-89.2C723.2,331.7,612.6,281,500,281c-112.6,0-223.2,50.7-328.5,134.1c-36,28.4-68.8,58.8-97.9,89.2c-17.6,18.4-30.3,33-37.4,41.8C1,585.5,0.9,651,38.3,692.1c0,0,17.6,20.9,35.3,39.3c29.1,30.4,61.9,60.8,97.9,89.2C276.8,904,387.4,954.7,500,954.7C612.6,954.7,723.2,904,828.5,820.6z M236.4,738.5c-31.9-25.3-61.3-52.4-87.3-79.6c-9.1-9.5-17-18.2-23.8-26c-3.9-4.5-6.5-7.6-7.6-9l-2.1-2.5c-1.1-1.2-1-6.2,0.5-7.8c2.8-3.4,5.4-6.4,9.3-11c6.8-7.8,14.7-16.5,23.8-26c26-27.1,55.3-54.3,87.3-79.6C325,427.1,415.3,385.7,500,385.7c84.7,0,175,41.4,263.6,111.5c31.9,25.3,61.3,52.4,87.3,79.6c9.1,9.5,17,18.2,23.8,26c3.9,4.5,6.5,7.6,7.6,9l2.1,2.5c1.1,1.2,1,6.2-0.5,7.8c-2.8,3.4-5.4,6.4-9.3,11c-6.8,7.8-14.7,16.5-23.8,26c-26,27.1-55.3,54.3-87.3,79.6C675,808.6,584.7,849.9,500,849.9C415.3,849.9,325,808.6,236.4,738.5z M500.5,752.2c79.5,0,144-64.5,144-144s-64.5-144-144-144c-79.5,0-144,64.5-144,144S421,752.2,500.5,752.2z"/></g>
</svg>`

const $clearViewBtn = document.createElement('button');
$clearViewBtn.classList.value = 'pure-button pure-button-success clear-view-button';
$clearViewBtn.innerHTML = clearIcon;
$clearViewBtn.addEventListener('click', () => {
    const isCleared = document.body.getAttribute('nht-clear-view') === 'true';
    if (isCleared) {
        document.body.removeAttribute('nht-clear-view');
        $clearViewBtn.innerHTML = clearIcon;
    } else {
        document.body.setAttribute('nht-clear-view', 'true');
        $clearViewBtn.innerHTML = viewIcon;
    }
})

setTimeout(() => {
    document.querySelector('.main-container.mcq-container').prepend($clearViewBtn);
}, 2000);