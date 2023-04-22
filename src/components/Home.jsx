import React from 'react'

import hero from "../assets/heroImg.jpg"
import { Box, Image} from '@chakra-ui/react'
const Home = () => {
  return (
    <Box bgColor={'blackAlpha.900'} w={"full"} h={"85vh"}>
      <Image 
      src={hero} 
      alt={"Crypto Hero Image"}
      w={"full"}
      h={"full"}
      objectFit={"fill"}
       />
      
      {/* <Text
      fontSize={"6xl"}
      textAlign={"center"}
      fontWeight={"thin"}
      color={"whiteAlpha.900"}
      // alignSelf={"center"}
      justifyContent={"center"}
      >
      XCrypto
      </Text> */}
    </Box>
   
  )
}

export default Home
