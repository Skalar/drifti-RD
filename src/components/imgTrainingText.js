import React from 'react'
import {VStack, Text } from '@chakra-ui/react'

function ImgTrainingText() {
    return (
        <VStack alignItems='left' spacing={7} p={5} pt={0}>
            <VStack spacing={2}>
                <Text fontSize={16}>
                    Dette er en prototype av bildeklassifisereren til Drifti. Ideen er å automatisk gi bilder kategorieforslag så vi kan strukturere
                    bildene bedre og på sikt bruke dette til å forbedre andre deler av Dritiproduktet.  </Text>
                <Text fontSize={16} > Med denne prototypen ønsker vi å teste hvor god maskinlæringsmodellen vi har er, og i tillegg bruke dere som tester den
                    til å trene modellen. </Text>
            </VStack>

            <VStack alignItems='left' spacing={0.5}>
                <Text fontSize={17} fontWeight='bold' color='blue.500' as='u'>
                    Slik fungerer prototypen:  </Text>
                <Text fontSize={16} > På venstre side ser du et bilde som er tatt av en rørlegger. På høyre side vil du få opp ulike etiketter.
                    Huk av for de etikettene du mener passer for bildet som vises.</Text>
            </VStack>
            <VStack alignItems='left' spacing={0.5}>
                <Text fontSize={16} color='blue.500'>
                    Mangler det en passende etikett?   </Text>
                <Text fontSize={16} > Legg til alternativ i innskrivnings-feltet ”Savner du et alternativ”</Text>
            </VStack>
            <VStack alignItems='left' spacing={0.5}>
                <Text fontSize={16} color='blue.500'>
                    Ferdig?</Text>
                <Text fontSize={16} > Trykk på "Lagre og gå videre". Da vil svarene dine bli registrert, og du får opp et nytt bilde.</Text>
            </VStack>
            <VStack alignItems='left' spacing={0.5}>
                <Text fontSize={16} color='blue.500'>
                    Usikker på hvilke etiketter som passer?</Text>
                <Text fontSize={16} > Trykk på "Hopp over" for å hoppe over bildet, og gå videre til neste</Text>
            </VStack>
        </VStack>
    )
}

export default ImgTrainingText
