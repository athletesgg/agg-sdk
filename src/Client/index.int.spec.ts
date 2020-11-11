import Client from '.'

const url = 'https://api-v3.athletes.gg'

jest.mock('yeast', () => () => 'taylor-swift-13')

describe('Client', () => {
  it('should initialize a basic client', () => {
    const client = new Client({
      url,
    })

    expect(client.url).toEqual(url)
    expect(client).toMatchSnapshot()
  })

  it('should get suitupalex', async () => {
    const client = new Client({
      url,
    })

    const user: Record<string, unknown> = await client.getUser('5843c579b07a244d5aab0d30')

    expect(user).toMatchSnapshot()
  })
})
