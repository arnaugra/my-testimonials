export function zodIssuesToObj(zodError) {
    const out = {}
    zodError.errors.forEach(issue => {
        const key = issue.path[0] ?? '_'
        if (!out[key]) out[key] = issue.message
    })
    return out
}