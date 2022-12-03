import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Input,
  Text,
} from '@chakra-ui/react'
import { Topic } from '../types'

export default function TopicSelector({
  topics,
  setTopic,
  topic,
  setTopicId,
  topicId,
}: {
  topics: Topic[]
  topic: string
  setTopic: React.Dispatch<React.SetStateAction<string>>
  topicId: string
  setTopicId: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="mt-4">
      <Tabs onChange={() => setTopic('')}>
        <TabList>
          <Tab>Topics</Tab>
          <Tab>Create Topic</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Select
              onChange={(e) => setTopicId(e.currentTarget.value)}
              placeholder="Select a topic"
              value={topicId}
            >
              {topics?.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </Select>
          </TabPanel>
          <TabPanel>
            <Text mb="8px">Topic: </Text>
            <Input
              onChange={(e) => setTopic(e.currentTarget.value)}
              value={topic}
              variant="filled"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}
