import React from 'react'
import {
    Box, CircularProgressLabel, CircularProgress, Icon, Flex,
    Text, HStack, Stack, Table, Textarea, Spacer, Th, Thead, Td, Tr,
    Tbody, Divider, Wrap, 
} from '@chakra-ui/react'
import { FaHammer, FaSearch } from 'react-icons/fa'
import PageHeader from '../../components/PageHeader'

import tfModel from "./model.js"

function CTEDemo() {
    let [textValue, setTextValue] = React.useState('')
    const [editetText, setEditetText] = React.useState()
    // const [dict, setDict] = React.useState({})
    const [timeGuessed, setTimeGuessed] = React.useState(0)
    const [timeCalculated, setTimeCalculated] = React.useState(0)
    const [Difference, setDifference] = React.useState(0)
    const [error, setError] = React.useState(undefined)
    const [reccommend, setRecommended] = React.useState([])


    let handleOnChange = (e) => {
        let inputValue = e.target.value
        setTextValue(inputValue)
        handleSubmit()
    }

    // Prepping text from input field. Removes all lines that are on the wrong format, including articles with 4 digits.
    // Sets calculated time from 'timer 3001' from inputfield 
    let handleSubmit = (e) => {

        let dictLocal = {}
        let timeCalTemp = 0
        let prep = textValue.split('\n')
        const eachline = []
        prep.forEach(element => {
            let line = element.split('\t')
            if ((line.length === 4)) {
                if (line[2] === '3001') {
                    timeCalTemp += parseFloat(line[0])
                }
                if (line[2].length !== 4) {
                    eachline.push({
                        productName: line[3],
                        productNumber: line[2],
                        quantity: line[0],
                        unit: line[1],
                        used: tfModel.is_active(line[2])
                    })
                    dictLocal[line[2]] = line[0]
                }
            }
        });
        tfModel.classify(dictLocal).then(time=>{setTimeGuessed(time)})
        tfModel.reccomend(Object.keys(dictLocal)).then(function(response){
            response.json().then(function(text){
                setRecommended(text)
            })
        })
        setTimeCalculated(timeCalTemp)
        setEditetText(eachline)
        setParam(timeCalTemp)
    }


    function setParam(timeCalc) {
        //TODO: Replace 2 with guessed time from model
        setDifference(timeGuessed - timeCalc)
        setError(Math.abs((timeCalc-timeGuessed)/timeGuessed*100))
    }

    return (
        <Wrap direction='column' backgroundColor='gray.50' padding={10} paddingTop={3} minHeight='100vh' overflowY='auto' overflowX='auto'>
            <PageHeader title = 'TIME ESTIMATION' section = 'Demo'></PageHeader>
            <Wrap justify='space-between' pt= {8} >
                {/* Left side: input*/}
                <Wrap borderWidth={2} bg='white' shadow='md' h='70vh' w='60%' p={10} pt= {5} direction='column' rounded="xl" minWidth='550px' align='stretch' overflowY='auto' overflowX='auto'>
                    <Text  color='gray.400' fontWeight='bold' fontSize='15'> Input</Text>
                    <Textarea borderColor='gray.300' variant='outline' backgroundColor='gray.50' height='10vh'
                        placeholder='Paste text here...'
                        onChange={handleOnChange} />
                    <Box rounded="lg" backgroundColor='white' borderColor='gray.300' mt='5' p={2}  borderWidth={1} maxHeight='45vh' overflowY='auto' overflowX='auto'>
                        <Table size='sm' variant='striped' overflowY='auto' overflowX='auto'>
                            <Thead><Tr>
                                <Th>Product name</Th>
                                <Th>Product number</Th>
                                <Th>Quantity</Th>
                                <Th>Unit</Th>
                            </Tr></Thead>
                            <Tbody>
                            {editetText?.map((product) => (
                                <Tr key={Math.random()} style={{color: product.used ? 'blue':'black'}}>
                                    <Td >{product.productName}</Td>
                                    <Td >{product.productNumber}</Td>
                                    <Td >{product.quantity}</Td>
                                    <Td >{product.unit}</Td>
                                </Tr>))}
                            </Tbody>
                        </Table>
                    </Box>
                </Wrap>

                {/* Right side: result */}
                <Flex borderWidth={2} bg='white' shadow='md' h='70vh' w='35%' paddingTop={10} p={5} direction='column' rounded="xl" minWidth='400px' justify='space-between'>
                    <Text color='gray.400' fontWeight='bold' fontSize='15'> Result</Text>
                    <Flex direction='row' paddingTop={10} >
                        <Stack direction='column' spacing={8} w='100%' align='left' >
                            <Flex direction='row' align='center' >
                                <Icon as={FaHammer} color='gray.500' boxSize='10' mr={4}></Icon>
                                <Text  color='blue.500' fontWeight='bold' fontSize='18' > Calculated  </Text>
                                <Spacer />
                                <Text color='blue.500' fontWeight='bold' fontSize='20'  > {timeCalculated}h </Text>
                            </Flex>
                            <HStack alignItems='center' >
                                <Icon as={FaSearch} color='gray.500' boxSize='9' mr={4}></Icon>
                                <Text  color='blue.500' fontWeight='bold' fontSize='18'>Guessed </Text>
                                <Spacer />
                                <Text  color='blue.500' fontWeight='bold' fontSize='20'> {timeGuessed}h</Text>
                            </HStack>
                        </Stack> </Flex>
                    <Divider mt={5} borderWidth={1} />

                    <Flex direction='row' align='center' mt={5} >
                        <Text  color='blue.500' fontWeight='bold' fontSize='18' ml={2} > Difference</Text>
                        <Spacer />
                        <Text  color='blue.500' fontWeight='bold' fontSize='20'>{Difference.toFixed(1)}h</Text>
                    </Flex>
                   
                    <Flex align='center' justify='center' mt={5} >
                        <CircularProgress value={error} color='blue.400' size='150px'>
                            {error? <CircularProgressLabel  fontSize={20}>{error.toFixed(1)}% </CircularProgressLabel> : <></>}
                        </CircularProgress>
                    </Flex>
                    <Text color='blue.500' fontWeight='bold' fontSize='18' textAlign='center'>Percentage Error</Text>
                    
                </Flex>
                <Flex borderWidth={2} bg='white' shadow='md' h='70vh' w='35%' paddingTop={10} p={5} direction='column' rounded="xl" minWidth='400px' justify='space-between'>
                    <Text color='gray.400' fontWeight='bold' fontSize='15'> Reccomended Items</Text>
                    <Table size='sm' variant='striped' overflowY='auto' overflowX='auto'>
                            <Thead><Tr>
                                <Th>Product name</Th>
                                <Th>Product number</Th>
                            </Tr></Thead>
                            <Tbody>
                            {Object.keys(reccommend).map((label) => (
                                <Tr key={Math.random()}>
                                    <Td >{reccommend[label]}</Td>
                                    <Td >{label}</Td>
                                </Tr>))}
                            </Tbody>
                        </Table>
                    
                </Flex>
            </Wrap>
        </Wrap>
    )
}

export default CTEDemo
