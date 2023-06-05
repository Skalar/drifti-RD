import React from 'react'
import AccordianButton from '../components/AccordianButton';
import { useNavigate } from "react-router-dom";
import { Box, Flex,  Drawer, DrawerContent, IconButton, useDisclosure } from '@chakra-ui/react'
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Image } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { FaRegClock, FaFileInvoice, FaImage } from 'react-icons/fa'


// Local imports
import DrawerButton from '../components/DrawerButton';

const Navbar = () => {
  let logo = require('../assets/images/rdLogo.png')
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex backgroundColor='white' h='10vh' align='center' borderWidth={2} direction='row' p={4}><>
      <IconButton _hover={{ bg: "gray.50", }} backgroundColor='transparent' color='gray.500' icon={<HamburgerIcon />} onClick={onOpen}>Open Drawer</IconButton>
      <Box p={10} pl={0} maxWidth='300px' maxWidth='40vh'>
        <Image src={logo}></Image>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen} size='xs'>
        <DrawerContent  borderRight='solid' borderColor='gray.200' borderRightWidth={5} >
        <Box p={6}  >
          <Image src={logo}></Image>
        </Box>
          <Accordion allowToggle>

            {/* CTE */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <DrawerButton text='Time Estimation' icon={FaRegClock}></DrawerButton>
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Box onClick={() => { navigate("/cte/Demo") }}>
                  <AccordianButton text='Demo'></AccordianButton>
                </Box>
                <Box onClick={() => { navigate("/cte/Stat") }}>
                  <AccordianButton text='Analytics'></AccordianButton>
                </Box>
              </AccordionPanel>
            </AccordionItem>

            {/* Invoice */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <DrawerButton text='Invoice Reader' icon={FaFileInvoice}></DrawerButton>
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Box onClick={() => { navigate("/invoiceReader/Demo") }}>
                  <AccordianButton text='Demo'></AccordianButton>
                </Box>
              </AccordionPanel>
            </AccordionItem>

            {/* Image labelling */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <DrawerButton text='Image Labelling' icon={FaImage} ></DrawerButton>
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Box onClick={() => { navigate("/imageLabelling/Training") }}>
                  <AccordianButton text='Training'></AccordianButton>
                </Box>
              </AccordionPanel>
            </AccordionItem>
            
          </Accordion>
        </DrawerContent>
      </Drawer>
    </>
    </Flex>
  )
}

export default Navbar

