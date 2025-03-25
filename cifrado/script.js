let ABC = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let pos = 5;
let texto = "melonn";
let textoCifrado = "";
let textoDescifrado= "";

for (let i = 0; i < texto.length; i++) {
let M = texto.charAt(i);

let index = ABC.indexOf(M);

if (index == -1) {
textoCifrado += M;
} else {
textoCifrado += ABC[(index + pos) % ABC.length];
}

}

console.log(textoCifrado);

for (let i = 0; i < textoCifrado.length; i++) {

let c = textoCifrado.charAt(i);

let index = ABC.indexOf(c);

if (index == -1) {
textoCifrado += c;
} else {
textoDescifrado += ABC[(index - pos) % ABC.length];
}

}

console.log(textoDescifrado);