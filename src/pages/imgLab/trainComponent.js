import { React, useState} from 'react'
import { Flex, Text, Spacer, Checkbox, CheckboxGroup, Input, Wrap, Button, useDisclosure} from '@chakra-ui/react'
import rootLocation from '../../assets/serverloc';

import Popup from '../../components/Popup'

function TrainComponent(props) {

    let [inputValue, setInputValue] = useState()
    let [rmValue,setRmValue] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure();

    
    const setCheckedState = props.setCheckedState
    
    const handleAddLabel = e => {
        if (!(inputValue in props.checkedState) && inputValue) {
            props.checkedState[inputValue]=false
            setCheckedState(props.checkedState)
        }
        else {
            if (!inputValue) {
                alert('Kan ikke legge til tom etikett')
            }
            else {
                alert('Etikett eksisterer allerede')
            }
        }
        setInputValue("")
    }

    let handleRemoveLabel= () =>{
        let l=rmValue
        
        // delete checkedState[l]
        // setCheckedState(checkedState)
        // if (confirm("Do you really want to remove this label from ALL classifications? Label: "+l)){
        setRmValue("")
        fetch(rootLocation+`/image/api/remove?label=`+l, {
                method: "GET",
                credentials: "include",
                cache: "no-cache",
                headers: new Headers({
                "content-type": "application/json"
                })
        }).then(function(response) {
            
            // get_random()
        })      
            
        // }
    }

    let handleInput = (e) => {
        setInputValue(e.target.value)
    }
    let handleInput2= (e)=>{
        setRmValue(e.target.value)
    }
    function toCapitalize(string){
        if(!string || string.length ===0) return string
        if (string==='WC') return string
        let str=string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        return str
    }
    // CurrentLabels consists of all checked checkboxes
    const onCheck = (e,value) => {
        let tempCheckedStat={...props.checkedState}
        tempCheckedStat[value]= !props.checkedState[value]
        setCheckedState(tempCheckedStat)

    }


    return (
        <Flex direction='column'  alignSelf='center'>
            <CheckboxGroup variant="filled">
                <Wrap spacing="24px">
                    {Object.keys(props.checkedState).map((label) => {return ( 
                        <Checkbox  key={Math.random()} onChange={(e)=>onCheck(e,label)}
                         isChecked={props.checkedState[label]}>{toCapitalize(label)}</Checkbox>)})}
                    
                </Wrap>
            </CheckboxGroup>
            <Spacer />
            <Wrap direction='column' mt={8}>
                <Text  color='blue.500' fontSize={15} fontWeight='bold'>Savner du et alternativ?</Text>
                <Wrap direction='row' >
                    <Input borderColor='blue.400' fontSize={15} value={inputValue} variant='outline' maxWidth='75%' placeholder='Legg til her..' onChange={handleInput} />
                    <Spacer />
                    <Button  borderWidth={1} backgroundColor='transparent' borderColor='blue.400' color='blue.500' onClick={handleAddLabel}>Legg til</Button>
                </Wrap>
            </Wrap>
            <Wrap direction='column' mt={8}>
                <Text  color='blue.500' fontSize={15} fontWeight='bold'>Fjerner du en kategori?</Text>
                <Wrap direction='row' >
                    <Input borderColor='blue.400' fontSize={15} value={rmValue} variant='outline' maxWidth='75%' placeholder='Legg til her..' onChange={handleInput2} />
                    <Spacer />
                    <Button  borderWidth={1} backgroundColor='transparent' borderColor='blue.400' color='blue.500' onClick={onOpen}>Fjern</Button>
                    <Popup isOpen={isOpen} onClose = {()=>{setRmValue(''); onClose()}} title={"Remove "+toCapitalize(rmValue)} 
                        body={'Do you really want to remove "'+toCapitalize(rmValue)+'" from ALL classifications?'}
                        isError={true} submitLabel="Remove" submit={()=>handleRemoveLabel()} hasSubmit={true}/>
                </Wrap>
            </Wrap>
            <Spacer />
            
        </Flex>
    )
}

export default TrainComponent
