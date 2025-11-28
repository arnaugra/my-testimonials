const registerForm = document.querySelector('#registerForm')
const loginForm = document.querySelector('#loginForm')

registerForm && registerForm.addEventListener('input', (e) => deleteErrors())
loginForm && loginForm.addEventListener('input', (e) => deleteErrors())
function deleteErrors() {
    document.querySelectorAll(`[data-error]`).forEach(e => e.remove())
}

registerForm && registerForm.addEventListener('submit', submitForm)
loginForm && loginForm.addEventListener('submit', submitForm)

function submitForm(e) {
    e.preventDefault()
    deleteErrors()
    const formElement = e.target
    
    const form = {
        email: formElement.email.value,
        password: formElement.password.value
    }

    const errors = validarLogin(form)

    if (Object.keys(errors).length > 0) {
        for (const e in errors) {
            writeError(e, errors[e])
        }
    } else {
        if (formElement.id == 'registerForm') fetchRegister(form)
        if (formElement.id == 'loginForm') fetchLogin(form)
    }
}


function validarLogin({ email, password }) {
    const errors = {}

    if (!email) {
        errors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "El formato del email no es válido"
    }

    if (!password) {
        errors.password = "La contraseña es obligatoria"
    } else if (password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    return errors
}
function writeError(target, error) {
    const span = document.createElement('span')
    span.textContent = error
    span.dataset.error = ''
    span.classList.add('error')
    document.querySelector(`[data-${target}]`).append(span)
}

function fetchRegister(form) {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    .then(async res => {
        if (!res.ok) {
            const errorData = await res.json()
            console.error(errorData)
            writeError("errors", errorData.error)
            return
        }

        window.location.href = '/'
    })
    .catch(err => {
        console.error(err)
        writeError("errors", err.error)
    })
}

function fetchLogin(form) {
    fetch('/login/true', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include'
    })
    .then(async res => {
        if (!res.ok) {
            const errorData = await res.json()
            console.error(errorData)
            writeError("errors", errorData.error)
            return
        }

        window.location.href = '/api/testimonials'
    })
    .catch(err => {
        console.error(err)
        writeError("errors", err.error)
    })
}
