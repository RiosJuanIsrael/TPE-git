"use strict"


function generarCaptcha() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return captcha;
}

function setCaptcha() {
    const captchaTexto = document.getElementById('captcha-texto');
    captchaTexto.textContent = generarCaptcha();
}

document.addEventListener('DOMContentLoaded', () => {
    setCaptcha();

    const btnRefrescarCaptcha = document.getElementById('refrescar-captcha');
    btnRefrescarCaptcha.addEventListener('click', setCaptcha);

    const form = document.getElementById('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const captchaInput = form['captcha-input'].value.trim();
        const captchaTexto = document.getElementById('captcha-texto').textContent;
        const mensaje = document.getElementById('form-resultado');

        if (captchaInput === captchaTexto) {
            mensaje.textContent = 'Formulario enviado correctamente.';
            mensaje.style.color = 'green';
        } else {
            mensaje.textContent = 'CAPTCHA incorrecto. Inténtalo de nuevo.';
            mensaje.style.color = 'red';
            setCaptcha();
        }
    });
});
