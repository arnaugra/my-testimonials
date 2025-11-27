document.querySelectorAll(".switch-tri").forEach(element => {
    element.addEventListener("click", switchTestimonialValidation)
})

function switchTestimonialValidation(e) {
    const switchEl = e.currentTarget
    const { id } = switchEl.dataset
    const prevState = switchEl.dataset.state
    const newState = prevState == 1 ? -1 : 1

    switchEl.dataset.state = 0 // set to neutral

    fetch(`/api/testimonials/${id}/switch-validation`, {
        method: 'PATCH',
        credentials: 'include'
    })
    .then(res => {
        if (res.ok) switchEl.dataset.state = newState
        else switchEl.dataset.state = prevState
    })
    .catch(err => {
        console.error(err);
        switchEl.dataset.state = prevState
    })
}
