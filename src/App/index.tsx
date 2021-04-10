import React, {useState} from 'react'
import './style.css'
import {
  Heading, Box, Input, HStack, Center, Button, VStack, Flex,
  IconButton, Link, Stack, Text, ButtonGroup, Divider, useToast, Collapse,
  FormControl, FormLabel
} from "@chakra-ui/react"
import {ChevronDownIcon, ChevronUpIcon} from '@chakra-ui/icons'
import axios from 'axios'

const smallPredictionsSize = 5

const Footer = () =>
  <Box mt="auto" as="footer" role="contentinfo" py="6">
    <Flex
      direction={{base: 'column', md: 'row'}}
      maxW={{base: 'xl', md: '7xl'}}
      mx="auto"
      px={{base: '6', md: '8'}}
      align="center"
    >
      <a aria-current="page" aria-label="Back to Home page" href="/" rel="home">
      </a>
      <Stack
        my={{base: '6', md: 0}}
        direction={{base: 'column', md: 'row'}}
        marginStart={{md: '8'}}
        fontSize="sm"
        spacing={{base: '2', md: '8'}}
        textAlign={{base: 'center', md: 'start'}}
      >
        <Text>&copy; {new Date().getFullYear()} University of Exeter</Text>
        <Link>Privacy</Link>
        <Link>Terms and Conditions</Link>
      </Stack>
      <ButtonGroup marginStart={{md: 'auto'}} variant="ghost">
      </ButtonGroup>
    </Flex>
  </Box>

interface ServerResultsType {
  'data': {
    [key: string]: number
  }
}

type ClientPredictionsType = [string, number][]


function App() {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [predictions, setPredictions] = useState<ClientPredictionsType>([])
  const [serverFullname, setServerFullname] = useState('')
  const [showAllPredictions, setShowAllPredictions] = useState(false)

  const toast = useToast()

  const mockServerResponse: ServerResultsType = {
    'data': {
      'Russian': 0.65,
      'Moldovan': 0.1,
      'Ukrainian': 0.1,
      'Azerbaijani': 0.05,
      'Georgian': 0.1,
      'Moldovan2': 0.1,
      'Ukrainian2': 0.1,
      'Azerbaijani2': 0.05,
      'Georgian2': 0.1,
      'Moldovan3': 0.1,
      'Ukrainian3': 0.1,
      'Azerbaijani3': 0.05,
      'Georgian3': 0.1
    }
  }

  const getServerClassification = async (name: string, surname: string) => {
    return await axios.post("https://namepredictor.pythonanywhere.com/get_proba", {
      firstName: name,
      lastName: surname
    })
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setShowAllPredictions(false)
      setPredictions([])
      setIsLoading(true)
      const serverResults: ServerResultsType = await getServerClassification(name, surname)
      setServerFullname(`${name} ${surname}`)
      setPredictions(Object.entries(serverResults['data']).sort((a, b) => b[1] - a[1]))
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex h="100%" direction="column" borderTopWidth="5px" borderTopColor="gray.500">
      <Box as="main" mx="auto" maxW="500px" px="20px">
        <Center>
          <Heading textAlign="center" color="gray.700" mx="auto" mt={10}>Ethnicity classification</Heading>
        </Center>
        <form onSubmit={onSubmit}>
          <Flex mt={14} flexWrap={'wrap'} align="center" justify="center">
            <Flex flexGrow={1} m={2} direction="column">
              <FormControl>
                <FormLabel fontWeight="normal">Имя</FormLabel>
                <Input autoComplete="given-name"
                       value={name}
                       onChange={(event) => setName(event.target.value)}
                       id={'name'}
                       placeholder={'Лудмила'}/>
              </FormControl>
            </Flex>

            <Flex flexGrow={1} m={2} direction={'column'}>
              <FormControl>
                <FormLabel fontWeight="normal">
                  Фамилия
                </FormLabel>
                <Input autoComplete="family-name"
                       value={surname}
                       onChange={(event) => setSurname(event.target.value)}
                       id={'surname'}
                       placeholder={'Фрия'}/>
              </FormControl>
            </Flex>

          </Flex>
          <Center>
            <Button type="submit" colorScheme="gray" isLoading={isLoading} mt={10} size={'md'}>Classify</Button>
          </Center>
        </form>
        <Collapse in={predictions.length > 0}>
          <Divider mt={10}/>
          <Box my={10}>
            <Center>
              <Heading fontSize="26px" color="gray.700">{serverFullname}</Heading>
            </Center>
            <Box maxW={'99%'} mx={'auto'} borderRadius="5px" mt={10}
                 boxShadow="0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)">
              {
                predictions.slice(0, smallPredictionsSize).map((value, i) => {
                  if (i === 0) {
                    return (
                      <Flex key={value[0]} borderTopRadius="5px" bg={'gray.600'} p={4} px={6} justify="space-between">
                        <Text color={'white'} fontSize="lg" fontWeight={'semibold'}>
                          {value[0]}
                        </Text>
                        <Text color={'white'} fontSize="lg" fontWeight={'semibold'}>
                          {(value[1] * 100).toFixed(2)}%
                        </Text>
                      </Flex>
                    )
                  }
                  else return (
                    value[1] !== 0 && <Flex key={value[0]} borderTopWidth={'1px'} p={4} px={6} justify="space-between">
                      <Text>
                        {value[0]}
                      </Text>
                      <Text>
                        {(value[1] * 100).toFixed(2)}%
                      </Text>
                    </Flex>
                  )
                })
              }
              <Collapse in={showAllPredictions && predictions.length > 5}>
                {
                  predictions.slice(5).map((value, i) =>
                    value[1] !== 0 && <Flex key={value[0]} borderTopWidth={'1px'} p={4} px={6}
                                            justify="space-between">
                      <Text>
                        {value[0]}
                      </Text>
                      <Text>
                        {(value[1] * 100).toFixed(2)}%
                      </Text>
                    </Flex>)
                }
              </Collapse>

              {predictions.length > 5 && predictions[4][1] !== 0 &&
              <Flex h={8} w="100%" as={'button'} onClick={() => setShowAllPredictions((val) => !val)}
                    borderTopWidth={'1px'}
                    align="center" justify="center">
                {
                  showAllPredictions ?
                    <ChevronUpIcon color={'gray.400'} w={6} h={6}/> :
                    <ChevronDownIcon color={'gray.400'} w={6} h={6}/>
                }
              </Flex>
              }
            </Box>
          </Box>
        </Collapse>
      </Box>
      <Footer/>
    </Flex>
  )
}

export default App
