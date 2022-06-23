import { backOff } from '../../src/lib/backOff'

let time:number = 0
const testFunction = async (trys:boolean[]) => {
  if (!trys[time]) {
    time++
    throw new Error('error')
  }
  time++
}

const twoTimes:boolean[] = [
  false,
  true
]

describe('Back off test', () => {
  beforeEach(async () => {
    time = 0
  })
  afterEach(async () => {
    time = 0
  })
  test('should try 2 times', () => {

  })
})
