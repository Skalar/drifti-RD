import {
    Flex, VStack, Text, Box, Center, Icon, Button, useDisclosure, Divider,
    Modal, ModalBody, ModalContent, ModalOverlay, ModalHeader, ModalCloseButton, Wrap, Spacer,
} from '@chakra-ui/react'
import { React, useState } from 'react'
import { FaFolder, FaFilePdf } from 'react-icons/fa'
import { useDropzone } from "react-dropzone"
import { Document, Page, pdfjs } from 'react-pdf';
import PageHeader from '../../components/PageHeader';
import { FaDollarSign, FaCalendarAlt } from 'react-icons/fa'

import rootLocation from '../../assets/serverloc';


function InvoiceDemo() {
    const [files, setFiles] = useState([])
    const [invoiceUploaded, setInvoiceUploaded] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [price, setPrice] = useState(0)
    const [dates, setDates] = useState(['-'])


    pdfjs.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setInvoiceUploaded(true)
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            )
        },
    })


    let handleSubmit = (e) => {
        const formData = new FormData();

        formData.append("pdfFile", files[0]);
        formData.append("type",files[0].type)

        fetch(rootLocation+"/invoice/extract-text", {
            method: "post",
            body: formData
        }).then(response => {
            return response.text();
        }).then(extractedText => {
            let obj = fromStringRegex(extractedText.trim())
            setPrice(obj.sum)
            setDates(obj.dates)
        });
        // setPrice(1234.99)
        // setDates(['01.02.2022', '20.05.1999', '24.12.2023'])
    }
    let fromStringRegex=(text) => {
        let regex = /\d{1,3}( \d{3})*[,|.]\d{2}/g
        var matches = [...text.matchAll(regex)]
        var values = []
        for (let m in matches){
            values.push(matches[m][0])
        }
        values.sort(function(a,b){
            let _a = a.replace(",",'.').replace(" ","")
            let _b = b.replace(",",'.').replace(" ","")
            return parseFloat(_b)-parseFloat(_a)
        })
        var dateregex = /(\d{2}[\.\-/]){2}\d{4}/g
        var datematches = [...text.matchAll(dateregex)]
        var datearray = []
        for (let d in datematches){
            let date = datematches[d][0]
            let datesplit = date.split('.')
            //add better date matching
            //dd.mm.yy vs mm.dd.yy??
            if (datesplit[2]<"1980" || datesplit[2]> "2050" || datesplit[0]>31 ||datesplit[1]>31){
                continue
            }
            datearray.push(date)
        }
        return {sum:values[0],dates:datearray}
    }
    
    return (
        <Flex direction='column' backgroundColor='gray.50' padding={10} pt={5} overflowY='auto' overflowX='auto' minHeight='100vh' >
            <PageHeader title='INVOICE READER' section='Demo'></PageHeader>

            {/* Dropzone */}
            <Wrap rounded="xl" shadow='md' alignSelf='center' mt={5} pt={5} {...getRootProps()} backgroundColor='white' borderWidth={2} minHeight='100px' h='15vh' w='100%' _hover={{ bg: "gray.100", }} justify='center' direction='column' borderStyle='dashed' borderColor='gray.300'>
                <input {...getInputProps()} />
                <Text color='gray.400' textAlign='center' >Drop or upload file here</Text>
                <Center>
                    <Icon ml='5' color='gray.400' w={10} h={10}>{<FaFolder />}</Icon>
                </Center>
            </Wrap>

            {/* Left side of the page. Changes view if invoice is uploaded */}
            <Wrap direction='row' mt={5}>
                <Wrap justify='center' w='49%' rounded="xl" minWidth='400px'>
                    {invoiceUploaded ? files?.map((file) => (

                        //Invoice uploaded
                        <Flex key={file.name} direction='column' maxWidth='100%' >
                            <Box maxHeight='50vh' overflowY='auto' cursor='pointer' borderWidth={2}>
                                <Document file={file} onClick={onOpen} maxWidth='100%'>
                                    <Page pageNumber={1} />
                                </Document>
                            </Box>
                            <Button onClick={handleSubmit} backgroundColor='white' borderWidth={2} mt='3'>Submit</Button>
                        </Flex>)) :

                        // Invoice not uploaded
                        <Flex direction='column' justify='center' backgroundColor='white' h='50vh' w='100%' borderWidth={2}>
                            <Center>
                                <Icon color='gray.400' ml='8' boxSize={20}>{<FaFilePdf />}</Icon>
                            </Center>
                        </Flex>}
                </Wrap>

                {/* Results */}
                <Wrap borderWidth={2} bg='white' shadow='md' w='49%' paddingTop={10} p={8} direction='column' rounded="xl" minWidth='400px'>
                    <Text color='gray.400' fontWeight='bold' fontSize='15'> Result</Text>
                    <Wrap direction='row' align='center' pt={5} pb={8}>
                        <Icon as={FaDollarSign} color='gray.500' boxSize='10' mr={4}></Icon>
                        <Text color='blue.500' fontWeight='bold' fontSize='18' > Price:  </Text>
                        <Spacer />
                        <Text color='blue.500' fontWeight='bold' fontSize='20'  > {price},- </Text>
                    </Wrap>
                    <Divider/>
                    <Wrap pt= {5}>
                        <Icon as={FaCalendarAlt} color='gray.500' boxSize='9' mr={4}></Icon>
                        <Text color='blue.500' fontWeight='bold' fontSize='18' >Dates: </Text>
                        <Spacer />
                        <VStack spacing={4}>
                        {dates.length && dates.map((date) => (
                            <Text color='blue.500' fontWeight='bold' fontSize='20'>{date} </Text>))}
                        </VStack>
                    </Wrap>
                </Wrap>
            </Wrap>

            {/* Modal to preview invoice */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={'2xl'}
                closeOnEsc='true'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader alignSelf='center' >Preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody w='100%'>
                        <Center>
                            {files?.map((file) => (
                                <Document file={file} onClick={onOpen} cursor='pointer' overflowY='auto'>
                                    <Page pageNumber={1} />
                                </Document> ))}
                        </Center>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex >
    )
}

export default InvoiceDemo
