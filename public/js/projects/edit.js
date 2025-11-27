const editProjectForm = document.querySelector('#form')

editProjectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const id = editProjectForm.dataset.projectId
    
    const form = new FormData(editProjectForm)
    fetchSignIn(form, id)
})

function fetchSignIn(form, id) {
    fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        body: form,
        credentials: 'include'
    })
    .then(async res => {
        if (res.ok) history.back()
        const errorData = await res.json()
        console.error('Error en el login:', errorData)
        return
    })
    .catch(err => {
        console.error('Error en la solicitud:', err)
    })
}
