import { RowDataPacket } from 'mysql2'
import { getHatDBConnection } from '../lib/mysql'

export interface Material {
  id: number
  material: string
}

const cache: Map<number, Material> = new Map()

export async function fetch(): Promise<boolean> {
  const conn = await getHatDBConnection()
  if (conn == null) {
    return false
  }

  const [rows] = (await conn.execute(
    'SELECT * FROM co_material_map'
  )) as RowDataPacket[][]
  cache.clear()
  for (const row of rows) {
    cache.set(row.rowid, {
      id: row.rowid,
      material: row.material.replace('minecraft:', ''),
    })
  }
  return true
}

/**
 * 返回与材质 ID 匹配的材质对象。
 *
 * @param id 材质 ID
 * @returns 材质对象 或 null
 */
export async function getMaterial(id: number): Promise<Material | null> {
  if (!cache.has(id)) {
    await fetch()
    if (!cache.has(id)) return null
  }
  return cache.get(id) as Material
}
