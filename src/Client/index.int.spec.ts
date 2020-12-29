import Client from '.'

jest.mock('yeast', () => () => 'taylor-swift-13')

const url = 'https://api-v3.athletes.gg'
const client = new Client({
  url,
})

describe('Client', () => {
  afterAll(() => {
    client.disconnect()
  })

  it('should initialize a basic client', () => {
    expect(client.url).toEqual(url)
    expect(client).toMatchSnapshot()
  })

  it('should get suitupalex', async () => {
    const user: Record<string, unknown> =
      await client.getUser('5843c579b07a244d5aab0d30')

    expect(user).toMatchSnapshot()
  })

  it('should get 5 users', async () => {
    const users: Record<string, unknown>[] = await client.getUsers({
      $limit: 5,
    })

    expect(users).toMatchSnapshot()
  })

  it('should get Smash Ultimate', async () => {
    const game: Record<string, unknown> =
      await client.getGame('5b7d06c745e38b0015b24356')

    expect(game).toMatchSnapshot()
  })

  it('should get 5 games', async () => {
    const games: Record<string, unknown>[] = await client.getGames({
      $limit: 5,
    })

    expect(games).toMatchSnapshot()
  })

  it('should get ZSS', async () => {
    const character: Record<string, unknown> =
      await client.getCharacter('5bf8d509d0306a00174051e1')

    expect(character).toMatchSnapshot()
  })

  it('should get 5 characters', async () => {
    const characters: Record<string, unknown>[] = await client.getCharacters({
      $limit: 5,
    })

    expect(characters).toMatchSnapshot()
  })

  it('should get Ninjakilla vs SonicFox', async () => {
    const match: Record<string, unknown> =
      await client.getMatch('5de93b6186c0e40017c54ca8')

    expect(match).toMatchSnapshot()
  })

  it('should get 5 matches', async () => {
    const matches: Record<string, unknown>[] = await client.getMatches({
      $limit: 5,
    })

    expect(matches).toMatchSnapshot()
  })

  it('should get suitupalex (paginated)', async () => {
    await client.findPaginate(
      'users',
      () => ({
        _id: '5843c579b07a244d5aab0d30',
      }),
      (data?: Record<string, unknown>[]): void => {
        expect(data).toMatchSnapshot()
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
        expect(data).toMatchSnapshot()
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
