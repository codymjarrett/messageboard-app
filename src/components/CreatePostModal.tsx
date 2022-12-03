import { useRef, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import queryClient from '../queryClient'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
} from '@chakra-ui/react'
import TopicSelector from './TopicSelector'

interface CreatePostVariables {
  text: string
  picture: string
  name: string
  topicId: string | undefined
  email: string
  sub: string
  nickname: string
  topic: string | undefined
}

async function createPost({
  text,
  name,
  picture,
  topicId,
  email,
  sub,
  nickname,
  topic,
}: CreatePostVariables) {
  const response = await axios.post('/api/post', {
    text,
    name,
    picture,
    topicId,
    email,
    sub,
    nickname,
    topic,
  })
  return response.data
}

async function getAllTopics() {
  const response = await axios.get('/api/topic')
  return response.data.data
}

export default function CreatePostModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { user, isLoading: userIsLoading } = useUser()
  const [postText, setPostText] = useState('')
  const [topicId, setTopicId] = useState('')
  const [topic, setTopic] = useState('')
  const initialRef = useRef(null)

  const { data: topics } = useQuery({
    queryKey: ['topics'],
    queryFn: getAllTopics,
  })

  const shouldDisabledForTopic = (!topic && topicId) || (!topicId && topic)

  const { mutate: createPostMutation, isLoading: createPostMutationIsLoading } =
    useMutation({
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

  return (
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
            placeholder={`Post dat', ${user?.nickname || ''}!`}
            value={postText}
            onChange={(e) => setPostText(e.currentTarget.value)}
          />
          <TopicSelector
            topics={topics}
            setTopic={setTopic}
            topic={topic}
            setTopicId={setTopicId}
            topicId={topicId}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-center w-full">
            <Button
              size="md"
              height="48px"
              width="100%"
              border="2px"
              disabled={!postText || !shouldDisabledForTopic}
              onClick={() => {
                createPostMutation(
                  {
                    text: postText || '',
                    name: user?.name || '',
                    picture: user?.picture || '',
                    // create a topic selector
                    topicId: topicId ? topicId : undefined,
                    email: user?.email || '',
                    sub: user?.sub || '',
                    nickname: user?.nickname || '',
                    topic: topic ? topic : undefined,
                  },
                  {
                    onSuccess: () => {
                      setPostText('')
                      onClose()
                    },
                  }
                )
              }}
              isLoading={createPostMutationIsLoading}
            >
              Post
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
