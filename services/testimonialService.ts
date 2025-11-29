import { db } from "../db.js"
import { ResultSetHeader, RowDataPacket  } from "mysql2";
import { Testimonial, Project } from '../types/models.js'

type storeTestimonial = Omit<Testimonial, "id" | "soft_deleted">
type updateTestimonial = Partial<Omit<Testimonial, "id" | "soft_deleted">>
type testimonialItem = Testimonial & Partial<Project>

/**
 * Get all testimonials
 * @returns Promise<Testimonial[]>
 */
export async function index(): Promise<Testimonial[]> {
    const q = `
    SELECT
        t.id id,
        t.author author,
        t.message message,
        t.image_url image_url,
        t.created_at created_at,
        t.validated validated,

        p.name project_name,
        p.image_url project_image_url

    FROM testimonials t
    LEFT JOIN projects p ON p.id = t.project_id
    WHERE
        t.soft_deleted = ?
        AND
        (
            t.project_id IS NULL
            OR p.soft_deleted = ?
        );
    `
    const [rows] = await db.execute<RowDataPacket[]>(q, [false, false])
    return rows as Testimonial[]
}

/**
 * Store new testimonial
 * @param testimonial Testimonial
 * @returns Promise<Testimonial["id"]>
 */
export async function store(testimonial: storeTestimonial): Promise<Testimonial["id"]> {
    const keys = Object.keys(testimonial)
    const values = Object.values(testimonial)

    const columns = keys.join(", ")
    const data = values.map(() => "?").join(", ")

    const q_insert = `INSERT INTO testimonials (${columns}) VALUES (${data});`
    const [result] = await db.execute<ResultSetHeader>(q_insert, [...values])
    return result.insertId
}

/**
 * Show specific user by id
 * @param id User["id"]
 * @returns Promise<User>
 */
export async function show(id: Testimonial["id"]): Promise<Testimonial> {
    const q = "SELECT * FROM testimonials WHERE testimonials.id = ? AND testimonials.soft_deleted = ?;"
    const [rows] = await db.execute<RowDataPacket[]>(q, [id, false])
    return rows[0] as Testimonial
}

/**
 * Updates specific user by id
 * @param user fields to update
 * @returns Promise<void>
 */
export async function update(id: Testimonial["id"], user: updateTestimonial): Promise<void> {
    const keys = Object.keys(user)
    const values = Object.values(user)

    const setClause = keys.map(key => `${key} = ?`).join(', ')
    const q_update = `UPDATE testimonials SET ${setClause} where id = ?;`
    await db.execute(q_update, [...values, id])
}

/**
 * [Sorft-]Delete specific user by id
 * @param user User
 * @returns Promise<User> - [ deleted ]
 */
export async function destroy(id: Testimonial["id"]): Promise<Testimonial["id"]> {
    // const q_delete = "DELETE FROM testimonials WHERE testimonials.id = ?;"
    // const [result] = await db.execute<ResultSetHeader>(q_delete, [id])

    // soft_deleted
    const q_soft_delete = "UPDATE testimonials SET soft_deleted = ? where testimonials.id = ? AND testimonials.soft_deleted = ?;"
    const [result] = await db.execute<ResultSetHeader>(q_soft_delete, [true, id, false])

    if (result.affectedRows === 0) throw new Error()

    return id
}

export async function testimonialsList(): Promise<testimonialItem[]> {

    const q = `
    SELECT 
        t.author author,
        t.message message,
        t.image_url image_url,
        t.created_at created_at,

        p.name project_name,
        p.image_url project_image_url

    FROM testimonials t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE
        t.soft_deleted = ?
        AND
        t.validated = ?
        AND
        (
            t.project_id IS NULL
            OR p.soft_deleted = ?
        );
    `
    const [rows] = await db.execute<RowDataPacket[]>(q, [false, true, false]) 

    return rows as testimonialItem[]
}


export async function switchValidation(id: number): Promise<boolean> {
    const q = `UPDATE testimonials SET validated = NOT validated WHERE id = ? AND soft_deleted = ?;`

    const [result] = await db.execute<ResultSetHeader>(q, [id, false])

    return result.affectedRows > 0
}