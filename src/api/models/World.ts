import { RowDataPacket } from 'mysql2'
import { getHatDBConnection } from '../lib/mysql'

export interface World {
  id: number
  name: string
}

const cache: Map<number, World> = new Map()

export async function fetch(): Promise<boolean> {
  const conn = await getHatDBConnection()
  if (conn == null) {
    return false
  }

  const [rows] = (await conn.execute(
    'SELECT * FROM co_world'
  )) as RowDataPacket[][]
  cache.clear()
  for (const row of rows) {
    cache.set(row.rowid, {
      id: row.rowid,
      name: row.world,
    })
  }
  return true
}

/**
 * 返回与世界 ID 匹配的世界对象。
 *
 * @param id 世界 ID
 * @returns 世界对象 或 null
 */
export async function getWorld(id: number): Promise<World | null> {
  if (!cache.has(id)) {
    await fetch()
    if (!cache.has(id)) return null
  }
  return cache.get(id) as World
}
