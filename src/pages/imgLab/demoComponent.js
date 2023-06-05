import { React, useState, useEffect } from 'react'
import { Flex, Spacer, Box, Wrap} from '@chakra-ui/react'


function DemoComponent(props) {

    let [labels, setLabels] = useState(props.labels)


    useEffect(() => {
        setLabels(props.labels)
    }, [props.labels]);
    function toCapitalize(string){
        if (string==='WC') return string
        let str=string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        return str
    }

    return (
        
        <Flex  >
            <Wrap spacing="24px" style={{padding:'12px'}}>
                {Object.keys(labels).map((label) => (
                    <Box  key={Math.random()} style={{backgroundColor:'rgba(25, 243, 47, '+labels[label]+')', border: '#3365ff',
                            margin:'5px',  color: '#3365ff', borderRadius: "15px",  fontSize: '22px',
                            padding: '8px',  paddingRight: '12px', paddingLeft: '12px'}} 
                        type="text" value={label} >{toCapitalize(label)}</Box>))}
            </Wrap>
            
            <Spacer />
            <Spacer />
        </Flex>
    )
}

export default DemoComponent
