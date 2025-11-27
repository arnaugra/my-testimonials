import { db } from "../db.js"
import { ResultSetHeader, RowDataPacket  } from "mysql2";

interface Invitation {
    id: number
    project_id: number
    token: string
    expires_at: Date
    used_at?: Date
    soft_deleted: boolean
}

type storeInvitation = Omit<Invitation, "id" | "token" | "used_at" | "soft_deleted">
type updateInvitation = Partial<Omit<Invitation, "id" | "soft_deleted">>

/**
 * Get all invitations
 * @returns Promise<Invitation[]>
 */
export async function index(): Promise<Invitation[]> {
    const q = `
    SELECT
        p.name project_name,

        i.id id,
        i.token token,
        i.expires_at expires_at,
        i.used_at used_at

    FROM invitations i
    LEFT JOIN projects p ON p.id = i.project_id
    WHERE
        i.soft_deleted = ?
        AND
        (
            i.project_id IS NULL
            OR p.soft_deleted = ?
        )
        AND
        i.expires_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY
        i.expires_at ASC,
        i.used_at IS NULL,
        i.used_at desc;
    `
    const [rows] = await db.execute<RowDataPacket[]>(q, [false, false])
    return rows as Invitation[]
}

/**
 * Store new invitation
 * @param invitation Invitation
 * @returns Promise<Invitation["id"]>
 */
export async function store(invitation: storeInvitation): Promise<Invitation["id"]> {
    const keys = Object.keys(invitation)
    const values = Object.values(invitation)

    const columns = keys.join(", ")
    const data = values.map(() => "?").join(", ")

    const q_insert = `INSERT INTO invitations (${columns}) VALUES (${data});`
    
    const [result] = await db.execute<ResultSetHeader>(q_insert, [...values])
    return result.insertId
}

/**
 * Show specific invitation by id
 * @param id Invitation id
 * @returns Promise<Invitation>
 */
export async function show(id: Invitation["id"]): Promise<Invitation> {
    const q = "SELECT * FROM invitations WHERE invitations.id = ? AND invitations.soft_deleted = ?;"
    const [rows] = await db.execute<RowDataPacket[]>(q, [id, false])
    return rows[0] as Invitation
}

/**
 * Show specific invitation by id
 * @param id Invitation id
 * @returns Promise<Invitation>
 */
export async function update(id: Invitation["id"], invitation: updateInvitation): Promise<void> {
    const keys = Object.keys(invitation)
    const values = Object.values(invitation)

    const setClause = keys.map(key => `${key} = ?`).join(', ')
    const q = `UPDATE invitations SET ${setClause} where id = ?;`
    await db.execute(q, [...values, id])
}

/**
 * [Sorft-]Delete specific invitation by id
 * @param id invitation id
 * @returns Promise<Invitation["id"]> - [ deleted ]
 */
export async function destroy(id: Invitation["id"]): Promise<Invitation["id"]> {
    // const q_delete = "DELETE FROM invitations WHERE invitations.id = ?;"
    // const [result] = await db.execute<ResultSetHeader>(q_delete, [id])

    // soft_deleted
    const q_soft_delete = "UPDATE invitations SET soft_deleted = ? WHERE invitations.id = ? AND invitations.soft_deleted = ?;"
    const [result] = await db.execute<ResultSetHeader>(q_soft_delete, [true, id, false])

    if (result.affectedRows === 0) throw new Error()

    return id
}

export async function byToken(token: string): Promise<Invitation> {
    const q = `
    SELECT
        i.id id,

        p.id project_id,
        p.name project_name

    FROM invitations i
    LEFT JOIN projects p ON p.id = i.project_id
    WHERE
        i.token = ?
        AND
        i.soft_deleted = ?
        AND
        i.expires_at > NOW()
        AND
        i.used_at IS NULL
        AND
        (
            p.soft_deleted = ?
            OR
            p.id IS NULL
        );
    `
    const [rows] = await db.execute<RowDataPacket[]>(q, [token, false, false])
    return rows[0] as Invitation
}
