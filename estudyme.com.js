function getAudioAndImagePart1() {
    if (!document.querySelector('.MuiPaper-root .title')?.textContent?.includes('Part 1')) {
        return null;
    }
    const $main = document.getElementById('main-game-play-section');
    if (!$main) {
        return null;
    }
    let audioURL = $main.querySelector('audio')?.getAttribute('src');
    let imageURL = $main.querySelector('img')?.getAttribute('src');
    if (!audioURL || !imageURL) {
        return null;
    }
    console.log('Part 1 audio and image found:', audioURL, imageURL);
    return {
        audio: audioURL,
        image: imageURL
    }
}


setInterval(getAudioAndImagePart1, 3000);