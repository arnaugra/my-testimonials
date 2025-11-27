export interface Testimonial {
    id: number
    project_id: number
    invitation_id: number
    name: string
    message: string
    validated?: boolean
    image_url?: string
    created_at?: Date
    soft_deleted?: boolean
}

export interface Project {
    id: number
    name: string
    image_url?:string
    soft_deleted: boolean
}