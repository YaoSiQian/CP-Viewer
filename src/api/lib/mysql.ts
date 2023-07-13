import { Connection, createConnection } from 'mysql2/promise'

export async function getHatDBConnection(): Promise<Connection | null> {
  try {
    const connection = await createConnection({
      host: process.env.HATDBHOST,
      port:
        process.env.HATDBPORT !== undefined
          ? Number.parseInt(process.env.HATDBPORT)
          : undefined,
      user: process.env.HATDBUSER,
      password: process.env.HATDBPASS,
      database: process.env.HATDBNAME,
      timezone: '+08:00',
    })
    await connection.beginTransaction()

    return connection
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return null
  }
}
