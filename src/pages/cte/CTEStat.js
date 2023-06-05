import React, {  useEffect, useState} from 'react'
import { Flex, Text, VStack, HStack, Spacer, Spinner, Wrap, Slider, Button,
    SliderTrack,SliderFilledTrack, SliderThumb, RangeSlider, Select,
    RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb,} from '@chakra-ui/react'
import ChartScatter from '../../components/ChartScatter.js'
import * as d3 from 'd3';
import csvData from '../../assets/22_06_data.csv'
import csvData2 from '../../assets/22_08_data.csv'
import csvData3 from '../../assets/22_09_data.csv'
import csvData4 from '../../assets/22_09_From.csv'
import csvData5 from '../../assets/22_09_data_kobb.csv'
import csvData6 from '../../assets/22_09_data_fake.csv'
import DoughnutChart from '../../components/DoughnutChart.js';
import PageHeader from '../../components/PageHeader';


function CTEStat() {
    const [data, setData] = useState(undefined)
    const [dataArrayGuess, setDataArrayGuess] = useState([])
    const [deviationGuess, setDeviationGuess] = useState(undefined)
    const [accErrGuess, setAccErrGuess] = useState([])

    const [dataArrayCalc, setDataArrayCalc] = useState([])
    const [deviationCalc, setDeviationCalc] = useState(undefined)
    const [accErrCalc, setAccErrCalc] = useState([])

    const [dataLength, setDataLength] = useState(undefined)
    let [acceptedError, setAcceptedError] = useState(0.1)
    const errorOff = 5
    const [loadingData, setLoadingData] = useState(true)
    let [dognutDataGuess, setDognutDataGuess] = useState(undefined)
    let [dognutDataCalc, setDognutDataCalc] = useState(undefined)

    let [offGuess, setOffGuess] = useState(undefined)
    let [offCalc, setOffCalc] = useState(undefined)
    let [lowerFoundBound,setLowerFoundBound] = useState(.7)
    let [upperFoundBound,setUpperFoundBound] = useState(1.0)
    let [showmore, setShowMore] = useState(false)
    let [sizeBound,setSizeBound] = useState([0,400])

    let [bounds,setbounds] = useState([0,100,0,100]) //[xmin,xmax,ymin,ymax]


    async function treatData() {

        const filteredData = data.filter(row => row.Real < bounds[1] && row.Real > bounds[0] && row.len>sizeBound[0] && row.len<sizeBound[1])
        const dataLength = filteredData.length

        let accErrGuessTemp = []
        let accErrCalcTemp = []
        let dataArrayGuessTemp = []
        let dataArrayCalcTemp = []

        let offGuess = []
        let offCalc = []

        let doghnutDataGuess = [0, 0, 0, 0]
        let doghnutDataCalc = [0, 0, 0, 0]

        let guessTot = 0
        let calcTot = 0

        await filteredData.forEach((row, i) => {
            if (row.Real !== 0 && (lowerFoundBound<=row.pFound && upperFoundBound>= row.pFound)) {
            // if (rowReal !== 0) {
                const rowGuess = row.Guess
                const rowReal  = row.Real
                const guessDiff = rowGuess / rowReal
                const calcDiff  = row.Calc / rowReal

                guessTot += Math.abs(parseFloat(rowGuess - rowReal))
                calcTot += Math.abs(parseFloat(row.Calc - rowReal))

                if (guessDiff >= 1 - acceptedError && guessDiff <= 1 + acceptedError) {
                    accErrGuessTemp.push({ 'x': rowReal, 'y': rowGuess })
                    doghnutDataGuess[1] += 1
                }

                else if (Math.abs((rowGuess - rowReal) / rowGuess) > errorOff || Math.abs((rowReal - rowGuess) / rowReal) > errorOff) {
                    offGuess.push({ 'x': rowReal, 'y': rowGuess })
                    doghnutDataGuess[3] += 1
                }

                else {
                    dataArrayGuessTemp.push({ 'x': rowReal, 'y': rowGuess })
                    if (guessDiff >= 1 + acceptedError) {
                        doghnutDataGuess[2] += 1
                    }
                    else { doghnutDataGuess[0] += 1 }
                }

                if (calcDiff >= 1 - acceptedError && calcDiff <= 1 + acceptedError) {
                    accErrCalcTemp.push({ 'x': rowReal, 'y': row.Calc })
                    doghnutDataCalc[1] += 1
                }
                else if (Math.abs((row.Calc - rowReal) / row.Calc) > errorOff || Math.abs((rowReal - row.Calc) / rowReal) > errorOff) {
                    offCalc.push({ 'x': rowReal, 'y': row.Calc })
                    doghnutDataCalc[3] += 1
                }

                else {
                    dataArrayCalcTemp.push({ 'x': rowReal, 'y': row.Calc })
                    if (calcDiff >= 1 + acceptedError) {
                        doghnutDataCalc[2] += 1
                    }
                    else { doghnutDataCalc[0] += 1 }
                }
            }
        });

        for (let i = 0; i <= 3; i++) {
            doghnutDataCalc[i] = (doghnutDataCalc[i] / dataLength * 100).toFixed(2)
            doghnutDataGuess[i] = (doghnutDataGuess[i] / dataLength * 100).toFixed(2)
        }
        
        setDeviationCalc(calcTot / dataLength)
        setDeviationGuess(guessTot / dataLength)
        setAccErrCalc(accErrCalcTemp)
        setAccErrGuess(accErrGuessTemp)
        setDataArrayCalc(dataArrayCalcTemp)
        setDataArrayGuess(dataArrayGuessTemp)
        setDataLength(dataLength)
        setDognutDataGuess(doghnutDataGuess)
        setDognutDataCalc(doghnutDataCalc)
        setOffCalc(offCalc)
        setOffGuess(offGuess)
    }


    async function getCSVData(csvFile) {
        await d3.text(csvFile, function (text) {
            const data = d3.csv.parse(text)
            setData(data)
        })
    }


    useEffect(() => {
        (async () => {
            if (data === undefined) {
                try {
                    await getCSVData(csvData);
                } catch (err) {
                    console.log(err)
                }
            }
        })()
    },[])

    useEffect(() => {
        if (data !== undefined) {
            treatData()
            setLoadingData(false)
        }
    }, [data,acceptedError,lowerFoundBound,upperFoundBound,bounds,sizeBound])

    function handleSelect(event){
        if (event.target.value === '3'){
            getCSVData(csvData3)
        }
        else if (event.target.value==='2'){
            getCSVData(csvData2)
        }
        else if (event.target.value==='1'){
            getCSVData(csvData)
        }
        else if (event.target.value==='4'){
            getCSVData(csvData4)
        }
        else if (event.target.value==='5'){
            getCSVData(csvData5)
        }
        else if (event.target.value==='6'){
            getCSVData(csvData6)
        }
    }

    return (
        loadingData ? <Spinner/> :
            <Flex direction='column' backgroundColor='gray.50' padding={10} paddingTop={3} overflowY='auto' minHeight='100vh'>
                <PageHeader title = 'TIME ESTIMATION' section = 'Analytics'></PageHeader>
                {/* TOP: General info */}
                <Select  onChange={handleSelect} width="20%">
                    <option value='1'>June 2022</option>
                    <option value='2'>August 2022</option>
                    <option value='3'>September 2022</option>
                    <option value='4'>Akk Sept 2022</option>
                    <option value='5'>Akk Grouping</option>
                    <option value='6'>Akk Inference</option>
                </Select>
                <Flex borderWidth={2} bg='white' shadow='md' h='15%' w='100%' m={10} direction='column' minHeight='15vh' rounded="xl" minWidth='400px' alignSelf='center' justify='center'  >
                    <Wrap pr={20} pl={20} >
                        <VStack spacing={-1} >
                            <Text  color='gray.400' fontWeight='bold' fontSize='18'>Std Deviation Calculated</Text>
                            {deviationGuess !== undefined && <Text  color='blue.500' fontWeight='bold' fontSize='18'>{deviationCalc.toFixed(1)}h</Text>}
                            {deviationGuess === undefined && <Text  color='blue.500' fontWeight='bold' fontSize='18'>undefined</Text>}
                        </VStack><Spacer />
                        <VStack spacing={-1}>
                            <Text  color='gray.400' fontWeight='bold' fontSize='18'>Std Deviation Guess</Text>
                            {deviationGuess !== undefined && <Text  color='blue.500' fontWeight='bold' fontSize='18'>{deviationGuess.toFixed(1)}h</Text>}
                            {deviationGuess === undefined && <Text  color='blue.500' fontWeight='bold' fontSize='18'>undefined</Text>}
                        </VStack><Spacer />
                        <VStack spacing={-1}>
                            <Text color='gray.400' fontWeight='bold' fontSize='18'>Accuracy</Text>
                            {dataLength && <Text  color='blue.500' fontWeight='bold' fontSize='18'>{(accErrGuess.length / dataLength * 100).toFixed(1)}%</Text>}
                        </VStack><Spacer />

                        {/* Error acceptance drawer*/}
                        <VStack spacing={-1}>
                            <Text  color='gray.400' fontWeight='bold' fontSize='18'>Error acceptance: </Text>
                            <Slider aria-label='slider-ex-1' defaultValue={0.1} min={0.0} max={1.0} step={0.05} onChangeEnd={(val) => setAcceptedError(val)}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Text  color='blue.500' fontWeight='bold' fontSize='18'>{(acceptedError*100).toFixed(0)}%</Text>
                        </VStack><Spacer />
                        { showmore ? 
                        <VStack spacing={-1}>
                            <Text  color='gray.400' fontWeight='bold' fontSize='18'>Percent in Model: </Text>
                            <RangeSlider defaultValue={[0.7, 1.0]} min={0.0} max={1.0} step={.02} onChangeEnd={(val) => {setLowerFoundBound(val[0]);setUpperFoundBound(val[1])}}>
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} />
                                <RangeSliderThumb index={1} />
                            </RangeSlider>
                            <Text  color='blue.500' fontWeight='bold' fontSize='18'>{(lowerFoundBound*100).toFixed(0)}% - {(upperFoundBound*100).toFixed(0)}%</Text>
                        </VStack>
                        :<Button color='blue' onClick={()=>setShowMore(true)}>+</Button>
                        }
                        { showmore ? <Spacer /> :''}  

                        { showmore ? 
                        <VStack spacing={-1}>
                            <Text  color='gray.400' fontWeight='bold' fontSize='18'>Number if Items in Job: </Text>
                            <RangeSlider defaultValue={[0, 400]} min={0} max={400} step={5} onChangeEnd={(val) => {setSizeBound([val[0],val[1]])}}>
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} />
                                <RangeSliderThumb index={1} />
                                
                            </RangeSlider>
                            <Text  color='blue.500' fontWeight='bold' fontSize='18'>{sizeBound[0].toFixed(0)} - {sizeBound[1].toFixed(0)}</Text>
                        </VStack>
                        :''} 
                        { showmore ? <Spacer /> :''}  

                        { showmore ? 
                        <VStack spacing={-1}>
                             <Text  color='gray.400' fontWeight='bold' fontSize='18'>Invoiced Hours Focus: </Text>
                            <RangeSlider defaultValue={[0, 100]} min={0} max={200} step={5} onChangeEnd={(val) => {setbounds([val[0],val[1],val[0],val[1]])}}>
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} />
                                <RangeSliderThumb index={1} />
                                
                            </RangeSlider>
                            <Text  color='blue.500' fontWeight='bold' fontSize='18'>{bounds[0].toFixed(0)} - {bounds[1].toFixed(0)}</Text>
                        </VStack>
                        :''}
                        { showmore ? <Spacer /> :''}  
                        { showmore ? <Button color='blue' onClick={()=>setShowMore(false)}>&ndash;</Button> :''}
                    </Wrap>
                </Flex>

                <Wrap direction='row'  align='center' justify='center'>

                    <Flex p={5} borderWidth={2} bg='white' shadow='md'  w='49%' direction='column' rounded="xl" minWidth='400px' alignSelf='center' >
                        <Text  color='gray.400' fontWeight='bold' fontSize='15'> Craftsman Projection</Text>
                        <HStack h='100%' w='100%'>
                            <Flex p={3} h='105%' w='100%' mt={5} minWidth={300} minHeight='300px'>
                                <ChartScatter
                                    dataArray={dataArrayCalc}
                                    errorAccept={accErrCalc}
                                    offArray={offCalc}
                                    label1='Outside error acceptance'
                                    label2='Within error acceptance'
                                    label3='> 500% error' 
                                    titleX='Invoiced Hours'
                                    titleY='Craftsman Projection'
                                    bounds={bounds}/>
                                
                            </Flex>
                        </HStack>                       
                    </Flex>

                    <Spacer />

                    <Flex p={5} borderWidth={2} bg='white' shadow='md'  w='49%' direction='column' rounded="xl" minWidth='400px' alignSelf='center' >
                        <Text  color='gray.400' fontWeight='bold' fontSize='15'> Machine Projection</Text>
                        <HStack h='100%' w='100%'>
                            <Flex p={3} h='105%' w='100%' mt={5} minWidth={300} minHeight='300px' >
                                <ChartScatter
                                    dataArray={dataArrayGuess}
                                    errorAccept={accErrGuess}
                                    offArray={offGuess}
                                    label1='Outside error acceptance'
                                    label2='Within error acceptance'
                                    label3='> 500% error' 
                                    titleY='Machine Projection'
                                    titleX='Invoiced Hours'
                                    bounds={bounds}
                                    />
    
                            </Flex>
                        </HStack>
                    </Flex>
                </Wrap>

                <Wrap direction='row' mb={20} align='center' justify='center' mt= {5}>

                    <Flex p={5} borderWidth={2} bg='white' shadow='md' h='100%' w='49%' direction='column' rounded="xl" minWidth='400px' alignSelf='center' >
                        <Text  color='gray.400' fontWeight='bold' fontSize='15'> Craftsman Projected Results</Text>
                        <HStack h='80%' w='80%' alignSelf='center' justifySelf='center' mt={5} >
                            <Flex p={3} w='90%' mt={5} minWidth={300} minHeight='300px'  >
                                {dognutDataCalc !== undefined && <DoughnutChart dataArray={dognutDataCalc} />}
                            </Flex>
                        </HStack>
                    </Flex>

                    <Spacer />

                    <Flex p={5} borderWidth={2} bg='white' shadow='md'  w='49%' direction='column' rounded="xl" minWidth='400px' alignSelf='center'  >
                        <Text  color='gray.400' fontWeight='bold' fontSize='15'> Machine Estimate Results</Text>
                        <HStack h='80%' w='80%' alignSelf='center' justifySelf='center' mt={5}>
                            <Flex p={3} w='90%' mt={5} minWidth={300} minHeight='300px'  >
                                {dognutDataGuess !== undefined && <DoughnutChart dataArray={dognutDataGuess} />}
                            </Flex>
                        </HStack>
                    </Flex>
                </Wrap>
            </Flex>
    )
}

export default CTEStat
