const editInvitationForm = document.querySelector('#form')

editInvitationForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const id = editInvitationForm.dataset.invitationId
    
    const form = new FormData(editInvitationForm)

    fetchSignIn(form)
})

function fetchSignIn(form) {
    fetch(`/api/testimonials`, {
        method: 'POST',
        body: form,
        credentials: 'include'
    })
    .then(async res => {
        if (res.ok) window.location.href = '/'
        const errorData = await res.json()
        console.error('Error al guardar testimonio:', errorData)
        return
    })
    .catch(err => {
        console.error('Error en la solicitud:', err)
    })
}
