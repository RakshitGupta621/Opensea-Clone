import sanityClient from '@sanity/client'

export const client = sanityClient({
    projectId: 'y76hb4ru',
    dataset: 'production',
    apiVersion: '2021-03-25',
    token: 'skTG73Sfhuoa7oXISKQB2eUpotdcuZNNrmXpVD9p92WEYN8Se1jcUhhmNhIKbbngbd1Nulo6hyqFZ2nAUnBBFyDHooYmiitifNMwjXSLGptRb4SmvMmhxVkSgXwEMUZTipsKgkhoVttsSWPRIcjrg9all1sZUpLNgbv5ylIWWG0I71vFL14i',
    useCdn: false,
  })