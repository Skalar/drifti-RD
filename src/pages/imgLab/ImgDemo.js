import { React, useState, useEffect } from 'react'
import { Flex, HStack, Text, Spacer, useDisclosure, Box, Wrap, Image, Button } from '@chakra-ui/react'

//Local import
import PageHeader from '../../components/PageHeader';
import ImgTrainingText from '../../components/imgTrainingText';
import ImgDemoview from './demoComponent';
import ImgTrainView from './trainComponent'
import rootLocation from '../../assets/serverloc';
import Popup from '../../components/Popup'

// import Axios from 'axios'; 

import tfModel from './model.js'

function ImgTraining() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    

    let [img1,setimg] = useState()
    let [labels, setLabels] = useState({ARBEIDSPLASS: 0.07022804766893387, UTEKRAN: 0.02251})
    let [checkedState, setCheckedState] = useState([])
    let [activepage,setActivePage]=useState(false)

    useEffect(()=>{
        if (!img1)getRandomImage()
        if (checkedState.length===0)getlables()
    })
    useEffect(() => {
    }, [checkedState]);
    
    function getRandomImage(){
        fetch(rootLocation+'/image/api/random')
        .then(function(response) {
            response.text().then(function(text){
                setimg(text)
            })})
        var checkedstatetemp={}
        for(let i in checkedState) checkedstatetemp[i]=false
        setCheckedState(checkedstatetemp)
    }
    function getlables(){
        fetch(rootLocation+'/image/api/labels')
        .then(function(response) {
            response.json().then(function(text){
                let defaultlabels= ['Rør', 'Vask', 'Baderom', 'WC', 'Dusj', 'Vaskemaskin', 'Avløp', 'Sluk']
                if (text.length>0){
                    defaultlabels = text
                }
                
                var target = {};
                defaultlabels.forEach(key => target[key] = false);
                setCheckedState(target)
                
            })})
    }
    let handleSkip = e => {
        getRandomImage()
    }
    let handleChange= e =>{
        let imgpix = tfModel.dom_to_pixels(e.target)
        tfModel.classify(imgpix,0).then(e=>{
            //classify(imgpix,i) 'i' asks to return the 'i' top most accuarate. if 'i'==0 everything is returned
            // for(let i in labels){
            //     if( i in e) labels[i]=e[i]
            //     else labels[i]=0
            // }
            setLabels(e)
        })

    }
    let handleSave = e => {
        let formData = {}
        let checkedArticle = []
        for ( let i in checkedState){
            if(checkedState[i]) checkedArticle.push(i.toUpperCase())
        }
        formData[img1]=checkedArticle
        if(checkedArticle.length ===0) return
        fetch(rootLocation+'/image/api/add', {
            method: "POST",
            body: JSON.stringify(formData),
            credentials: "include",
            cache: "no-cache",
            headers: new Headers({
            "content-type": "application/json"
            })
        })
        .then(function(response) {
            response.text().then(function(text){
                
                // setLables(JSON.parse(text.replaceAll("'",'"')))
            })})
        
        getRandomImage()
        // setCurrentLabels([])
        // setCheckedState(new Array(labels.length).fill(false))
    }

    return (
        
        <Flex direction='column' backgroundColor='gray.50' padding={10} paddingTop={0} overflowY='auto' overflowX='auto' minHeight='100vh'>
            {/* Header */}
            <Wrap spacing={4} alignItems='left' direction='row' p ={5}>
                <PageHeader title='BILDEGJENKJENNING' section='Trening av modell'></PageHeader>
                <Spacer />
                <Button  color='blue.500' fontWeight='bold' fontSize='18' size='md' background='transparent' onClick={onOpen}>Lurer du på noe?</Button>
            </Wrap>

            {/* Explanation modal */}
            <Popup isOpen={isOpen} onClose = {onClose} title="Forklaring" body={<ImgTrainingText/>}/>
            
            <Wrap >
                {/* Image */}
                <Box p={5} w='50%' minWidth='400px' maxWidth='650px'>
                    <Image src={img1} onLoad={handleChange} crossOrigin='anonymous' alt="Random Image"></Image>
                </Box>
                <Spacer />

                {/* Labels */}
                <Flex p={20} pb={10} pt={10} borderWidth={2}  shadow='md' w='49%' direction='column' rounded="xl" minHeight='450px' minWidth='400px' alignSelf='center' >
                    <Flex alignSelf='center' gap='3'>
                        <Button borderWidth={1} backgroundColor='transparent' borderColor='blue.400' color='blue.500' isDisabled={!activepage} onClick={()=>setActivePage(false)}>Training</Button>
                        <Button borderWidth={1} backgroundColor='transparent' borderColor='blue.400' color='blue.500' isDisabled={activepage} onClick={()=>setActivePage(true)}>Inference</Button>
                    </Flex>
                    <Text mb={5}  color='blue.500' fontSize={15} fontWeight='bold'>Etiketter</Text>
                    {activepage ? <ImgDemoview labels={labels}/>: <ImgTrainView checkedState={checkedState} setCheckedState={setCheckedState}/>}
                    
                    <Spacer />
                    <Spacer />
                    {activepage ?
                    <HStack>
                        <Button  borderWidth={1} backgroundColor='transparent' borderColor='blue.400' color='blue.500' onClick={handleSkip}> Gå Videre</Button>
                    </HStack>
                    :
                    <HStack>
                        <Button  borderWidth={1} backgroundColor='transparent' borderColor='blue.400' color='blue.500' onClick={handleSkip}> Hopp over </Button>
                        <Button  borderWidth={1} backgroundColor='transparent' borderColor='blue.400' color='blue.500' onClick={handleSave}> Lagre og gå videre</Button>
                    </HStack>
                    }
                </Flex>
            </Wrap>
        </Flex>









    )
}

export default ImgTraining
