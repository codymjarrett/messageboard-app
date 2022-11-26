import { queryClient } from '../queryClient'
import axios from 'axios'
import classNames from 'classnames'
import { DEVELOPMENT_BASE_URL } from '../constants'

import PostTile from '../components/PostTile'

import { Post } from '../types'

interface Props {
  data: Post[]
}

export default function Home(props: Props) {
  const { data } = props

  console.log({ data })
  console.log(data)
  return (
    <div className="mx-auto">
      {data.map((post, index) => (
        <div key={post.id} className={classNames({ 'mt-5': index !== 0 })}>
          <PostTile
            text={post.text}
            profilePic={post.user.profile_pic}
            username={post.user.username}
            topic={post.topic.title}
            comments={post.comments}
            createdAt={post.createdAt}
          />
        </div>
      ))}
    </div>
  )
}

export const getServerSideProps = async () => {
  const props = await queryClient.fetchQuery(['posts'], async () => {
    const { data } = await axios.get(DEVELOPMENT_BASE_URL + 'api/post')
    return data
  })

  return {
    props,
  }
}
