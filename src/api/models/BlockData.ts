import { RowDataPacket } from 'mysql2'
import { getHatDBConnection } from '../lib/mysql'

export interface BlockData {
  id: number
  data: string
}

const cache: Map<number, BlockData> = new Map()

export async function fetch(): Promise<boolean> {
  const conn = await getHatDBConnection()
  if (conn == null) {
    return false
  }

  const [rows] = (await conn.execute(
    'SELECT * FROM co_blockdata_map'
  )) as RowDataPacket[][]
  cache.clear()
  for (const row of rows) {
    cache.set(row.rowid, {
      id: row.rowid,
      data: row.data,
    })
  }
  return true
}

/**
 * 返回与方块 ID匹配的方块数据对象。
 *
 * @param id 方块 ID
 * @returns 方块数据对象 或 null
 */
export async function getBlockData(id: number): Promise<BlockData | null> {
  if (!cache.has(id)) {
    await fetch()
    if (!cache.has(id)) return null
  }
  return cache.get(id) as BlockData
}
