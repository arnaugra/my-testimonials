export type User = {
    id: number
    email: string
    password_hash:string
    soft_deleted: boolean
}

export type Testimonial = {
    id: number
    project_id?: number
    invitation_id: number
    name: string
    message: string
    validated?: boolean
    image_url?: string
    created_at?: Date
    soft_deleted?: boolean
}

export type Invitation = {
    id: number
    project_id: number
    token: string
    expires_at: Date
    used_at?: Date
    soft_deleted: boolean
}

export type Project = {
    id: number
    name: string
    image_url?:string
    soft_deleted: boolean
}
