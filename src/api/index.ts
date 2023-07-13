import express, { NextFunction } from 'express'
import { RowDataPacket } from 'mysql2'
import { getEditData, getUserState } from './lib/CoreProtect'
import { getHatDBConnection } from './lib/mysql'
import { EditDataResult } from './models/EditDataResult'
import User from './models/User'

/*
  Prefix: /server/

  /: Hello world
  /users: Get recent login users
  /users/<UUID>: Get user id
  /users/<ID>/<PAGE>: Get user edit data
*/

const app = express()

app.get(
  '/',
  (_req: express.Request, res: express.Response, next: NextFunction) => {
    ;(async () => {
      const conn = await getHatDBConnection()
      if (conn == null) {
        res.status(500).json({ message: 'Database connection error.' })
        return
      }
      const siteName = process.env.SITE_NAME || 'CoreProtect Viewer'
      const pageTitle = process.env.PAGE_TITLE || 'CoreProtect Viewer'
      res.json({
        message: 'Hello world!',
        override: { siteName, pageTitle },
      })
    })().catch(next)
  }
)

app.get(
  '/users/:mcidOrUuid',
  (req: express.Request, res: express.Response, next: NextFunction) => {
    ;(async () => {
      const conn = await getHatDBConnection()
      if (conn == null) {
        res.status(500).json({ message: 'Database connection error.' })
        return
      }

      try {
        const [rows] = (await conn.execute(
          'SELECT * FROM co_user WHERE uuid IS NOT NULL AND (uuid LIKE ? OR user LIKE ?)',
          [`%${req.params.mcidOrUuid}%`, `%${req.params.mcidOrUuid}%`]
        )) as RowDataPacket[][]

        const ret: User[] = []
        for (const row of rows) {
          ret.push({
            userid: row.rowid,
            mcid: row.user,
            uuid: row.uuid,
          })
        }
        res.json(ret)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      } finally {
        conn.end()
      }
    })().catch(next)
  }
)

app.get(
  '/users/:userId/:page',
  (req: express.Request, res: express.Response, next: NextFunction) => {
    ;(async () => {
      const conn = await getHatDBConnection()
      if (conn == null) {
        res.status(500).json({ message: '数据库连接错误。' })
        return
      }

      try {
        if (isNaN(parseInt(req.params.userId))) {
          res
            .status(400)
            .json({ message: '请指定 userId 的数值。' })
          return
        }
        const userId: number = parseInt(req.params.userId, 10)

        if (isNaN(parseInt(req.params.page))) {
          res.status(400).json({ message: '请指定 page 的数值。' })
          return
        }
        const page: number = parseInt(req.params.page, 10)

        const conn = await getHatDBConnection()
        if (conn == null) {
          res.status(500).json({ message: '数据库连接错误。' })
          return
        }

        const filterAction =
          'filter' in req.query &&
          req.query.filter !== '' &&
          req.query.filter !== null
            ? (req.query.filter as string)
            : undefined

        const userState = await getUserState(conn, userId)
        const editData = await getEditData(conn, userId, page, filterAction)

        const result: EditDataResult = {
          count: {
            place: userState.placeCount,
            destroy: userState.destroyCount,
            rollbackPlace: userState.rollbackPlaceCount,
            rollbackDestroy: userState.rollbackDestroyCount,
            all: userState.allCount,
          },
          data: editData,
        }
        res.json(result)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      } finally {
        conn.end()
      }
    })().catch(next)
  }
)

module.exports = {
  path: '/api',
  handler: app,
}
