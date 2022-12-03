import { Fragment, lazy, Suspense } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import classNames from 'classnames'
import { useUser } from '@auth0/nextjs-auth0'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useDisclosure, Spinner } from '@chakra-ui/react'

import PostTile from '../components/PostTile'

import { Post } from '../types'

const LazyCreatePostModal = lazy(() => import('../components/CreatePostModal'))

export default function Home() {
  const { user, isLoading: userIsLoading } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const userLoggedIn = user !== undefined

  const {
    data: postsData,
    isLoading: postsDataIsLoading,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await axios.get(`/api/post`)
      return data
    },
  })

  const loading = userIsLoading || postsDataIsLoading

  const hasPosts = !!postsData?.data?.length

  return (
    <div className="mx-auto">
      {!loading ? (
        <Fragment>
          {userLoggedIn && (
            <div className="flex my-4 justify-center bg-white p-5 rounded-lg border-gray-200 border">
              <Image
                src={user.picture as string}
                width={50}
                height={50}
                className="rounded-full"
                alt="profile image"
              />
              <button
                className="ml-4 bg-slate-500 rounded-full w-96 text-left pl-4 text-white hover:bg-slate-400"
                onClick={onOpen}
              >
                {`Post dat', ${user?.nickname || ''}!`}
              </button>
            </div>
          )}
          {!hasPosts ? (
            <div>No Posts</div>
          ) : (
            <div className="mt-10">
              {postsData?.data.map((post: Post, index: number) => (
                <div
                  key={post.id}
                  className={classNames({ 'mt-5': index !== 0 })}
                >
                  <PostTile
                    text={post.text}
                    profilePic={post.user.profile_pic}
                    username={post.user.username}
                    topic={post.topic.title}
                    comments={post.comments}
                    createdAt={post.createdAt}
                    likes={post.likes}
                    postId={post.id}
                    refetchPosts={refetchPosts}
                  />
                </div>
              ))}
            </div>
          )}
          {isOpen && (
            <Suspense fallback={<Spinner />}>
              <LazyCreatePostModal isOpen={isOpen} onClose={onClose} />
            </Suspense>
          )}
        </Fragment>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  )
}
