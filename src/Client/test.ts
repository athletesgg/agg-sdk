import Client from '.'

describe('Client', () => {
  it('should set a URL', () => {
    const url = 'https://api-v3.athletes.gg'

    const client = new Client({
      url,
    })
    expect(client.url).toEqual(url)
  })
})
