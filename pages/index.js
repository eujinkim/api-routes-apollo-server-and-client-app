import { withApollo } from '../apollo/client'
import gql from 'graphql-tag'
import Link from 'next/link'
import { useQuery } from '@apollo/react-hooks'

const User = gql`
  query UserQuery {
    User {
      name
    }
  }
`

const Index = () => {
  const {
    data: { User: users }
  } = useQuery(User)

  if (users) {
    return (
      <div>
        <ul>
          { users.map((user => {
              return (
                <li key={user.name}>{user.name}</li>
              )
          })) }
        </ul>
        <Link href="/about">
          <a>static</a>
        </Link>{' '}
        page.
      </div>
    )
  }

  return null
}

export default withApollo(Index)
