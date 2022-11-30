import { useRef, useState } from 'react'
import Image from 'next/image'
import queryClient from '../queryClient'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import classNames from 'classnames'
import { useUser } from '@auth0/nextjs-auth0'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
} from '@chakra-ui/react'

import PostTile from '../components/PostTile'

import { Post } from '../types'

interface CreatePostVariables {
  text: string
  picture: string
  name: string
  topicId: string
  email: string
  sub: string
  nickname: string
}

async function createPost({
  text,
  name,
  picture,
  topicId,
  email,
  sub,
  nickname,
}: CreatePostVariables) {
  const response = await axios.post('/api/post', {
    text,
    name,
    picture,
    topicId,
    email,
    sub,
    nickname,
  })
  return response.data
}

export default function Home() {
  const { user, error, isLoading: userIsLoading } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [postText, setPostText] = useState('')

  const initialRef = useRef(null)

  const userLoggedIn = user !== undefined

  const buttonMessage = `What's on your mind, ${user?.nickname || ''}?`

  const { data, isLoading: queryIsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await axios.get('/api/post')
      return data
    },
  })

  const { mutate, isLoading: mutationIsLoading } = useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts'])

      // Optimistically update to the new value
      // @ts-ignore
      queryClient.setQueryData(['posts'], (oldPosts) => {
        // @ts-ignore
        const newValue = [...oldPosts?.data, newPost]

        return newValue
      })

      // Return a context object with the snapshotted value
      return { previousPosts }
    },
    onError: (err, newTodo, context) => {
      // @ts-ignore
      queryClient.setQueryData(['posts'], context.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  if (userIsLoading || queryIsLoading) {
    return <div>Loading...</div>
  }

  const hasPosts = !!data?.data?.length

  return (
    <div className="mx-auto">
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
            {buttonMessage}
          </button>
        </div>
      )}
      {!hasPosts ? (
        <div>No Posts</div>
      ) : (
        <div className="mt-10">
          {data?.data.map((post: Post, index: number) => (
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
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="text-center">Create post</div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              resize="none"
              size="lg"
              ref={initialRef}
              height="40"
              placeholder={buttonMessage}
              value={postText}
              onChange={(e) => setPostText(e.currentTarget.value)}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-center w-full">
              <Button
                size="md"
                height="48px"
                width="100%"
                border="2px"
                disabled={!postText}
                onClick={() =>
                  mutate(
                    {
                      text: postText || '',
                      name: user?.name || '',
                      picture: user?.picture || '',
                      // create a topic selector
                      topicId: '421d26a0-0460-4f88-bb76-2d2acb4cdacd',
                      email: user?.email || '',
                      sub: user?.sub || '',
                      nickname: user?.nickname || '',
                    },
                    {
                      onSuccess: () => {
                        setPostText('')
                        onClose()
                      },
                    }
                  )
                }
                isLoading={mutationIsLoading}
              >
                Post
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
