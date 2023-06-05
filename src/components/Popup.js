import { React } from 'react'
import { Modal, ModalBody, ModalContent, ModalOverlay, ModalHeader, ModalCloseButton, ModalFooter, Button } from '@chakra-ui/react'

function Popup(props){
    const onClose = function(){
        props.onClose()
    }
    const submit = function(){
        props.submit()
        onClose()
    }
    return(
    <Modal
        isOpen={props.isOpen}
        onClose={onClose}
        size={'2xl'}
        closeOnEsc='true'>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader  color='blue.500' fontWeight='bold' fontSize='20' alignSelf='center'>{props.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {props.body}
            </ModalBody>
            {props.hasSubmit ? <ModalFooter>
            <Button colorScheme='grey' mr={2} onClick={onClose}> Close </Button>
            <Button colorScheme={props.isError?'red':'blue'} mr={3} onClick={submit}>{props.submitLabel ?? "Submit"}</Button>
          </ModalFooter> : <></>}
        </ModalContent>
    </Modal>
    )
} 
export default Popup