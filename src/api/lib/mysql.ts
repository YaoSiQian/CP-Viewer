import { Connection, createConnection } from 'mysql2/promise'

export async function getHatDBConnection(): Promise<Connection | null> {
  try {
    const connection = await createConnection({
      host: process.env.DBHOST,
      port:
        process.env.DBPORT !== undefined
          ? Number.parseInt(process.env.DBPORT)
          : undefined,
      user: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
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
