const createInvitationForm = document.querySelector('#form')

createInvitationForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const form = {}
    form.project_id = createInvitationForm.project_id?.value,
    form.expires_at = createInvitationForm.expires_at.value,

    fetch('/api/invitations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include',
    })
    .then(res => {
        if (!res.ok) {
            const errorData = res.json()
            console.error(errorData)
            return
        }

        window.location.reload()

    })
    .catch(err => {
        console.error('Error en la solicitud:', err)
    })
})

document.querySelectorAll(".delete-button").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault()

        const { deleteInvitationId } = e.target.dataset

        fetch(`/api/invitations/${deleteInvitationId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res => {
            if (!res.ok) {
                const errorData = res.json()
                console.error(errorData)
                return
            }
            document.querySelector(`#p${deleteInvitationId}`).remove()
        })
        .catch(err => {
            console.error('Error en la solicitud:', err)
        })

    })
})
