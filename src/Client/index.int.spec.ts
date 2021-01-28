import _ from 'lodash'
import Client from '.'

jest.mock('yeast', () => () => 'taylor-swift-13')

const url = 'https://api-v3.athletes.gg'
const client = new Client({
  url,
})

function cleanObject(i?: Record<string, unknown>): Record<string, unknown> {
  return _.omitBy(i, (v, k) =>
    (k.includes('At') || k.includes('lastLogin')) && _.isNumber(v)
  )
}

function cleanCollection(collection?: Record<string, unknown>[]): Record<string, unknown>[] {
  return Array.isArray(collection) ? collection.map(cleanObject) : []
}

describe('Client', () => {
  afterAll(() => {
    client.disconnect()
  })

  describe('Setup', () => {
    it('should initialize a basic client', () => {
      expect(client.url).toEqual(url)
      expect(client).toMatchSnapshot()
    })
  })

  describe('Authentication', () => {
    it('should authenticate', async () => {
      const {
        user,
      } = await client.authenticate({
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        strategy: 'local',
      })

      expect(cleanObject(user)).toMatchSnapshot()
    })
  })

  describe('/users', () => {
    it('should get suitupalex', async () => {
      const user: Record<string, unknown> =
        await client.getUser('5843c579b07a244d5aab0d30')

      expect(cleanObject(user)).toMatchSnapshot()
    })

    it('should get suitupalex by slug', async () => {
      const user: Record<string, unknown> =
        await client.getUserBySlug('suitupalex')

      expect(cleanObject(user)).toMatchSnapshot()
    })

    it('should get 5 users', async () => {
      const users: Record<string, unknown>[] = await client.getUsers({
        $limit: 5,
      })

      expect(cleanCollection(users)).toMatchSnapshot()
    })

    it('should get suitupalex (paginated)', async () => {
      await client.findPaginate(
        'users',
        () => ({
          _id: '5843c579b07a244d5aab0d30',
        }),
        (data?: Record<string, unknown>[]): void => {
          expect(cleanCollection(data)).toMatchSnapshot()
        },
      )
    })

    it('should get 250 users (paginated)', async () => {
      let count = 0

      await client.findPaginate(
        'users',
        (lastItem) => {
          if (!lastItem) {
            return {}
          }

          return ({
            _id: {
              $gt: lastItem._id,
            },
          })
        },
        (data?: Record<string, unknown>[]): void => {
          expect(cleanCollection(data)).toMatchSnapshot()
          count += data ? data.length : 0
        },
      )

      expect(count).toEqual(250)
    })

    it ('should fail to get users (paginated)', async () => {
      await expect(client.findPaginate(
        'users',
        () => ({}),
        () => {
          throw(new Error('Long story short it was a bad time'))
        },
      )).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('/games', () => {
    it('should get Smash Ultimate', async () => {
      const game: Record<string, unknown> =
        await client.getGame('5b7d06c745e38b0015b24356')

      expect(cleanObject(game)).toMatchSnapshot()
    })

    it('should get 5 games', async () => {
      const games: Record<string, unknown>[] = await client.getGames({
        $limit: 5,
      })

      expect(cleanCollection(games)).toMatchSnapshot()
    })
  })

  describe('/characters', () => {
    it('should get ZSS', async () => {
      const character: Record<string, unknown> =
        await client.getCharacter('5bf8d509d0306a00174051e1')

      expect(cleanObject(character)).toMatchSnapshot()
    })

    it('should get 5 characters', async () => {
      const characters: Record<string, unknown>[] = await client.getCharacters({
        $limit: 5,
      })

      expect(cleanCollection(characters)).toMatchSnapshot()
    })
  })

  describe('/matches', () => {
    it('should get Ninjakilla vs SonicFox', async () => {
      const match: Record<string, unknown> =
        await client.getMatch('5de93b6186c0e40017c54ca8')

      expect(cleanObject(match)).toMatchSnapshot()
    })

    it('should get 5 matches', async () => {
      const matches: Record<string, unknown>[] = await client.getMatches({
        $limit: 5,
      })

      expect(cleanCollection(matches)).toMatchSnapshot()
    })
  })

  describe('/events', () => {
    it('should get Killer Instinct Cup 2017', async () => {
      const event: Record<string, unknown> =
        await client.getEvent('58e9333436847afe1b054f46')

      expect(cleanObject(event)).toMatchSnapshot()
    })

    it('should get Killer Instinct Cupt 2017 by slug', async () => {
      const event: Record<string, unknown> =
        await client.getEventBySlug('killer-instinct-cup-2017')

      expect(cleanObject(event)).toMatchSnapshot()
    })

    it('should get 5 events', async () => {
      const events: Record<string, unknown>[] = await client.getEvents({
        $limit: 5,
      })

      expect(cleanCollection(events)).toMatchSnapshot()
    })
  })

  describe('/activities', () => {
    it('should get Falcon Shorts #11', async () => {
      const activity: Record<string, unknown> =
        await client.getActivity('590448b59aa41200122cbe7b')

      expect(cleanObject(activity)).toMatchSnapshot()
    })

    it('should get 5 activities', async () => {
      const activities: Record<string, unknown>[] = await client.getActivities({
        $limit: 5,
      })

      expect(cleanCollection(activities)).toMatchSnapshot()
    })
  })

  describe('/placings', () => {
    it('should get SKTAR4 placing', async () => {
      const placing: Record<string, unknown> =
        await client.getPlacing('5b42f4759b72c90b0541d842')

      expect(cleanObject(placing)).toMatchSnapshot()
    })

    it('should get 5 placings', async () => {
      const placings: Record<string, unknown>[] = await client.getPlacings({
        $limit: 5,
      })

      expect(cleanCollection(placings)).toMatchSnapshot()
    })
  })

  describe('/schedules', () => {
    it('should get Check-In schedule event', async () => {
      const schedule: Record<string, unknown> =
        await client.getSchedule('5d92313622476000176d2330')

      expect(cleanObject(schedule)).toMatchSnapshot()
    })

    it('should get 5 schedules', async () => {
      const schedules: Record<string, unknown>[] = await client.getSchedules({
        $limit: 5,
      })

      expect(cleanCollection(schedules)).toMatchSnapshot()
    })
  })

  describe('/followers', () => {
    it('should get an athlete follower', async () => {
      const follower: Record<string, unknown> =
        await client.getFollower('5ceedc163828b80018116b90')

      expect(cleanObject(follower)).toMatchSnapshot()
    })

    it('should get 5 followers', async () => {
      const followers: Record<string, unknown>[] = await client.getFollowers({
        $limit: 5,
      })

      expect(cleanCollection(followers)).toMatchSnapshot()
    })
  })
})
