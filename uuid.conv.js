const enc = new TextEncoder().encode('2dcf511405f3750c754336711bd749d9')
let num = enc.reduce((v, i) => v*32 + i, 0)
num = num.toString(32).replace(/[0-9]/g, '')

console.log(num)