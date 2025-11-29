import { db } from "../db.js"
import { ResultSetHeader, RowDataPacket  } from "mysql2";
import { Project } from "../types/models.js";

type storeProject = Omit<Project, "id" | "soft_deleted">
type updateProject = Partial<Omit<Project, "id" | "soft_deleted">>

/**
 * Get all projects
 * @returns Promise<Project[]>
 */
export async function index(): Promise<Project[]> {
    const q = "SELECT * FROM projects WHERE projects.soft_deleted = ?;"
    const [rows] = await db.execute<RowDataPacket[]>(q, [false])
    return rows as Project[]
}

/**
 * Store new project
 * @param project Project
 * @returns Promise<Project["id"]>
 */
export async function store(project: storeProject): Promise<Project["id"]> {
    const keys = Object.keys(project)
    const values = Object.values(project)

    const columns = keys.join(", ")
    const data = values.map(() => "?").join(", ")

    const q_insert = `INSERT INTO projects (${columns}) VALUES (${data});`
    const [result] = await db.execute<ResultSetHeader>(q_insert, [...values])
    return result.insertId
}

/**
 * Show specific user by id
 * @param id User["id"]
 * @returns Promise<User>
 */
export async function show(id: Project["id"]): Promise<Project> {
    const q = "SELECT * FROM projects WHERE projects.id = ? AND projects.soft_deleted = ?;"
    const [rows] = await db.execute<RowDataPacket[]>(q, [id, false])
    return rows[0] as Project
}

/**
 * Updates specific user by id
 * @param user fields to update
 * @returns Promise<void>
 */
export async function update(id: Project["id"], user: updateProject): Promise<void> {
    const keys = Object.keys(user)
    const values = Object.values(user)

    const setClause = keys.map(key => `${key} = ?`).join(', ')
    const q_update = `UPDATE projects SET ${setClause} where id = ?;`
    await db.execute(q_update, [...values, id])
}

/**
 * [Sorft-]Delete specific user by id
 * @param user User
 * @returns Promise<User> - [ deleted ]
 */
export async function destroy(id: Project["id"]): Promise<Project["id"]> {
    // const q_delete = "DELETE FROM projects WHERE projects.id = ?;"
    // const [result] = await db.execute<ResultSetHeader>(q_delete, [id])

    // soft_deleted
    const q_soft_delete = "UPDATE projects SET soft_deleted = ? where projects.id = ? AND projects.soft_deleted = ?;"
    const [result] = await db.execute<ResultSetHeader>(q_soft_delete, [true, id, false])

    if (result.affectedRows === 0) throw new Error()

    return id
}


/**
 * Get all projects
 * @returns Promise<Project[]>
 */
export async function selectData(): Promise<Project[]> {
    const q = "SELECT id, name FROM projects WHERE projects.soft_deleted = ?;"
    const [rows] = await db.execute<RowDataPacket[]>(q, [false])
    return rows as Project[]
}