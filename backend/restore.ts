import { promises as fs } from 'fs'

async function restore() {
  const data = await fs.readFile('./db-backup.json', 'utf8')
  const json = JSON.parse(data)
  await fs.writeFile('./db.json', JSON.stringify(json, null, 2))

  console.log('Database restored!')
}

restore()
