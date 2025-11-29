import { db } from "../../db.js"
import { ResultSetHeader, RowDataPacket  } from "mysql2";
import { User } from "../types/models.js";

/**
 * Get all users
 * @returns Promise<User[]>
 */
export async function index(): Promise<User[]> {
    const q = "SELECT id, email FROM users WHERE users.soft_deleted = ?;"
    const [rows] = await db.execute<RowDataPacket[]>(q, [false])
    return rows as User[]
}

/**
 * Store new user
 * @param user 
 */
// export async function store(user) { .../routes/auth.ts: 8 }

/**
 * Show specific user by id
 * @param id User id
 * @returns Promise<User>
 */
export async function show(id: User["id"]): Promise<User> {
    const q = "SELECT id, email FROM users WHERE users.id = ? AND users.soft_deleted = ?;"
    const [rows] = await db.execute<RowDataPacket[]>(q, [id, false])
    return rows[0] as User
}

/**
 * Updates specific user by id
 * @param id 
 * @param user 
 */
// export async function update(id, user) {}

/**
 * [Sorft-]Delete specific user by id
 * @param id User id
 * @returns Promise<void>
 */
export async function destroy(id: User["id"]): Promise<void> {
    // const q_delete = "DELETE FROM users WHERE id = ?;"
    // const [result] = await db.execute<ResultSetHeader>(q_delete, [id])

    // soft_deleted
    const q_soft_delete = "UPDATE users SET users.soft_deleted = ? where users.id = ? AND users.soft_deleted = ?;"
    const [result] = await db.execute<ResultSetHeader>(q_soft_delete, [true, id, false])

    if (result.affectedRows === 0) throw new Error()
}
