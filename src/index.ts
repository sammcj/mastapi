// import * as readline from 'readline'
import generator, { Entity, Response } from 'megalodon'

// const rl: readline.ReadLine = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

const BASE_URL: string = 'https://aus.social'

const access_token: string = process.env.MASTODON_ACCESS_TOKEN as string

const client = generator('mastodon', BASE_URL, access_token)

// Get status
// client.getStatus('108739791879133672').then(res => {
//   console.log(res.data)
// })

// // Get a toot
// new Promise(resolve => {
//   rl.question('Toot: ', status => {
//     client
//       .postStatus(status)
//       .then((res: Response<Entity.Status>) => {
//         console.log(res)
//         rl.close()
//         resolve(res)
//       })
//       .catch(err => {
//         console.error(err)
//         rl.close()
//       })
//   })
// })

// // Get instance
// client.getInstance().then((res: Response<Entity.Instance>) => {
//   console.log(res)
// })

// Get filters
client.getFilters().then((res: Response<Entity.Filter[]>) => {
  console.log(res)
} )
