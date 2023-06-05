import React from 'react'
import {  Text, Wrap } from '@chakra-ui/react'

function PageHeader({title, section}) {
    return (
        <Wrap spacing={4} alignItems='left' p = {2}>
            <Text  color='blue.600' fontWeight='bold' fontSize='20'> {title}</Text>
            <Text  color='gray.400' fontWeight='bold' fontSize='20'> &bull;</Text>
            <Text  color='blue.600' fontWeight='bold' fontSize='20'>  {section}</Text>
        </Wrap>
    )
}

export default PageHeader
