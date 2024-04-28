import React, { useState, useEffect } from "react";
import { Box, Button, Input, Stack, Text, VStack, Container, Heading } from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";
// Mock function to simulate client behavior
const client = {
  getWithPrefix: async (prefix) => {
    return [{ value: { username: "user1", content: "Hello World!", createdAt: "2024-04-28T12:00:00.000Z" } }, { value: { username: "user2", content: "Another tweet here", createdAt: "2024-04-28T11:00:00.000Z" } }];
  },
  set: async (key, value) => {
    console.log(`Mock save: ${key}`, value);
  },
};

const Index = () => {
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    const fetchedTweets = await client.getWithPrefix("tweet:");
    if (fetchedTweets) {
      setTweets(fetchedTweets.map((t) => t.value).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  const handleTweet = async () => {
    if (username && content) {
      const tweet = {
        username,
        content,
        createdAt: new Date().toISOString(),
      };
      await client.set(`tweet:${Date.now()}`, tweet);
      setContent("");
      fetchTweets();
    }
  };

  return (
    <Container maxW="xl" centerContent>
      <VStack spacing={8} py={10}>
        <Heading as="h1" size="xl" textAlign="center">
          Mini Twitter <FaTwitter />
        </Heading>
        <Box w="100%">
          <Input placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} mb={2} />
          <Input placeholder="What's happening?" value={content} onChange={(e) => setContent(e.target.value)} mb={2} />
          <Button colorScheme="twitter" onClick={handleTweet} isDisabled={!username || !content}>
            Tweet
          </Button>
        </Box>
        <Stack spacing={4} w="100%">
          {tweets.map((tweet, index) => (
            <Box key={index} p={4} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">{tweet.username}</Text>
              <Text>{tweet.content}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(tweet.createdAt).toLocaleString()}
              </Text>
            </Box>
          ))}
        </Stack>
      </VStack>
    </Container>
  );
};

export default Index;
