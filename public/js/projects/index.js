const createProjectForm = document.querySelector('#form')

createProjectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const form = new FormData(createProjectForm)

    fetch('/api/projects', {
        method: 'POST',
        body: form,
        credentials: 'include'
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

        const { deleteProjectId } = e.target.dataset

        fetch(`/api/projects/${deleteProjectId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res => {
            if (!res.ok) {
                const errorData = res.json()
                console.error(errorData)
                return
            }
            document.querySelector(`#p${deleteProjectId}`).remove()
        })
        .catch(err => {
            console.error('Error en la solicitud:', err)
        })

    })
})
