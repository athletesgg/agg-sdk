import Client from '.'

jest.mock('yeast', () => () => 'taylor-swift-13')

const url = 'https://api-v3.athletes.gg'
const client = new Client({
  url,
})

describe('Client', () => {
  it('should initialize a basic client', () => {
    expect(client.url).toEqual(url)
    expect(client).toMatchSnapshot()
  })

  it('should get suitupalex', async () => {
    const user: Record<string, unknown> = await client.getUser('5843c579b07a244d5aab0d30')

    expect(user).toMatchSnapshot()
  })

  it('should get 5 users', async () => {
    const users: Record<string, unknown>[] = await client.getUsers({
      $limit: 5,
    })

    expect(users).toMatchSnapshot()
  })
})
