// import aes256 from 'aes256'

// const key = 'y5*)Q:J1IqFj|)g^/2<2)MM0i'
// export const cipher = aes256.createCipher(key)

/**
 * Database connection handler
 */
export let db

export function setDb(i) {
  db = i
}

export const MAX_WIN = 100

const MAX_TIME = 100000

export const ACCELERATION = (MAX_WIN - 1) / MAX_TIME / MAX_TIME * 2

export const RANKINGDATA = [
  "Beginner", "Pilot", "Explorer", "Astronaut",
  "Captain", "Commander", "Admiral", "Legend",
  "Master of the Universe", "God of Space"
]

export const getReward = (balance) => {
  if (balance < 10) {
    return 50;
  } else if (balance < 5000) {
    return 100;
  } else if (balance < 50000) {
    return 250;
  } else if (balance < 100000) {
    return 500;
  } else {
    return 1000;
  }
}

export const taskFilter = [
  "All", "Support us", "Collabs", "Game"
]