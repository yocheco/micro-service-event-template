import mongoose from 'mongoose'

import { Env } from '../env/env'

export async function startConnection () {
  const options = { keepAlive: true }

  mongoose.connect(Env.MONGOURI, options)
    .then(db => console.log('🤓 Mongoose is alive!!!!'))
    .catch(err => console.error(err))
}
