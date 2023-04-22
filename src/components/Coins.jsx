import React, { useEffect, useState } from 'react'
import { server } from "../index"
import axios from 'axios'
import { Button, Container, HStack, Heading, Image, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react'
import Loader from './Loader'
import ErrorComponent from './ErrorComponent'
import { Link } from 'react-router-dom'



const Coins = () => {

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page,setPage]=useState(1);
  const [currency,setCurrency]=useState("inr");

  const currencySymbol=currency==="inr"?"₹":currency==="eur"? "€":"$";

  const changePage=(page)=>{
    setPage(page);
    setLoading(true);
  }

  const btns=new Array(132).fill(1);


  useEffect(() => {


    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        setCoins(data);
        // console.log(data);
        setLoading(false);
      }
      catch (error) {
        setError(true);
        setLoading(false);
      }

    };


    fetchCoins();

  }, [currency,page])


  if(error) return <ErrorComponent message={"error while fetching coins: Please wait for a minute due to API limitations in fetching data in a minute"} />

 
  return <>
    <Container maxW={"container.xl"}>
      {
        loading ? <Loader /> : (
          <>


      <RadioGroup p={"8"} value={currency} onChange={setCurrency}>
        <HStack spacing={"4"} justifyContent={"center"}>
          <Radio value={"inr"}>INR</Radio>
          <Radio value={"eur"}>EUR</Radio>
          <Radio value={"usd"}>USD</Radio>
        </HStack>
      </RadioGroup>


            <HStack wrap={"wrap"} justifyContent={"center"} >
              {
                coins.map((i) => (
                  <CoinsCard
                    key={i.id}
                    id={i.id}
                    name={i.name}
                    img={i.image}
                    symbol={i.symbol}
                    price={i.current_price}
                    currencySymbol={currencySymbol}
                    />
                ))
              }
            </HStack>

            <HStack w={"full"} overflowX={"auto"} p={"8"}> 
              {
                btns.map((item,index)=>(
                  <Button 
                  key={index}
                  bgColor={'whiteAlpha.400'} 
                  color={"white"} 
                  onClick={()=>changePage(index+1)}
                  >
                    {index+1}
                    </Button>
                ))
              }

            </HStack>
          </>
        )

      }
    </Container>
  </>
}




const CoinsCard = ({ id,name, img,symbol,price,currencySymbol="₹"}) => {

  return (

    <Link to={`/coin/${id}`} >
      <VStack
        justifyContent={"center"}
        shadow={"2xl"}
        borderRadius={"lg"}
        transition={"all 0.3s"}
        m={"4"}
        p={"4"}
        bgColor={"whiteAlpha.500"}
        w={"52"}
        h={"52"}
        css={
          {
            "&:hover": {
              transform: "scale(1.1)"
            }
          }
        }>
        <Image src={img} w={"10"} h={"10"} objectFit={"contain"} alt={name} />
        <Heading size={"md"} noOfLines={1}>{symbol}</Heading>
        <Text noOfLines={1}>{name}</Text>
        <Text noOfLines={1}>{price?`${currencySymbol}${price}`:"NA"}</Text>
      </VStack>
      
     </Link>

  );
}
export default Coins
