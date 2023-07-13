import { RowDataPacket } from 'mysql2'
import mysql from 'mysql2/promise'
import * as BlockData from '../models/BlockData'
import { EditData } from '../models/EditDataResult'
import * as Material from '../models/Material'
import * as World from '../models/World'

interface UserState {
  placeCount: number
  destroyCount: number
  rollbackPlaceCount: number
  rollbackDestroyCount: number
  allCount: number
}

export async function getUserState(
  conn: mysql.Connection,
  userId: number
): Promise<UserState> {
  const [rows] = (await conn.execute(
    'SELECT COUNT(rowid) as allCount, SUM(action = 1) as placeCount, SUM(action = 0) as destroyCount, SUM(rolled_back = 1 and action = 1) as placeRollbackCount, SUM(rolled_back = 1 and action = 0) as destroyRollbackCount FROM co_block WHERE user = ?',
    [userId]
  )) as RowDataPacket[][]

  return {
    placeCount: parseInt(rows[0].placeCount, 10),
    destroyCount: parseInt(rows[0].destroyCount, 10),
    rollbackPlaceCount: parseInt(rows[0].placeRollbackCount, 10),
    rollbackDestroyCount: parseInt(rows[0].destroyRollbackCount, 10),
    allCount: rows[0].allCount,
  }
}

export async function getEditData(
  conn: mysql.Connection,
  userId: number,
  page: number,
  filterAction?: string
): Promise<EditData[]> {
  let sql =
    'SELECT * FROM co_block WHERE user = ? ORDER BY rowid DESC LIMIT ?, 50'
  if (filterAction !== undefined) {
    switch (filterAction) {
      case 'destroy':
        sql =
          'SELECT * FROM co_block WHERE user = ? AND action = 0 ORDER BY rowid DESC LIMIT ?, 50'
        break
      case 'place':
        sql =
          'SELECT * FROM co_block WHERE user = ? AND action = 1 ORDER BY rowid DESC LIMIT ?, 50'
        break
    }
  }
  const [rows] = (await conn.execute({
    sql,
    values: [userId, (page - 1) * 50],
    timeout: 60000,
  })) as RowDataPacket[][]

  const ret: EditData[] = []

  for (const row of rows) {
    const world: World.World | null = await World.getWorld(row.wid)
    const material: Material.Material | null = await Material.getMaterial(
      row.type
    )
    const blockdataIds =
      row.blockdata !== null ? row.blockdata.toString('utf-8').split(',') : []
    const blockdata: BlockData.BlockData[] = []
    for (const blockdataId of blockdataIds) {
      const bd = await BlockData.getBlockData(parseInt(blockdataId))
      if (bd === null) continue
      blockdata.push(bd)
    }

    if (row.action !== 0 && row.action !== 1) {
      continue
    }

    ret.push({
      id: row.id,
      time: row.time,
      world,
      x: row.x,
      y: row.y,
      z: row.z,
      material,
      blockdata,
      action: row.action,
      rollbacked: row.rolled_back,
    })
  }

  return ret
}
