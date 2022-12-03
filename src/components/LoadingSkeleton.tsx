import { Stack, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

export default function LoadingSkeleton() {
  return (
    <Stack>
      <Skeleton height="92px" mt="10" />
      <Skeleton height="294px" mt="40" />
      <Skeleton height="294px" mt="10" />
      <Skeleton height="294px" mt="10" />
      <Skeleton height="294px" mt="10" />
      <Skeleton height="294px" mt="10" />
    </Stack>
  )
}
