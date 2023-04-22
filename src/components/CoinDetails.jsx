import { Badge, Box, Button, Container, HStack, Image, Progress, Radio, RadioGroup, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../index';
import ErrorComponent from './ErrorComponent';

import LineChart from './LineChart';

const CoinDetails = () => {


  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);
  const params = useParams();


  const currencySymbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  
  const btns=["24h","7d","14d","30d","60d","200d","365d","max"];


  const switchChartStats=(val)=>{
    switch (val) {
      case "24h":
        setDays("24h")
        setLoading(true)
        break;
      case "7d":
        setDays("7d")
        setLoading(true)
        break;
      case "14d":
        setDays("14d")
        setLoading(true)
        break;
      case "30d":
        setDays("30d")
        setLoading(true)
        break;
      case "60d":
        setDays("60d")
        setLoading(true)
        break;
      case "200d":
        setDays("200d")
        break;
      case "365d":
        setDays("365d")
        setLoading(true)
        break;
      case "max":
        setDays("max")
        setLoading(true)
        break;
    
      default:
        setDays("24h")
        setLoading(true)
        break;
    }
  }

  useEffect(() => {

    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);

        const { data: chartData } = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`);

        setCoin(data);
        // console.log(data);
        setChartArray(chartData.prices);
        // console.log(chartData.prices);
        setLoading(false);
      }
      catch (error) {
        setError(true);
        setLoading(false);
      }

    };

    fetchCoin();

  }, [params.id ,currency,days])

  if (error) return <ErrorComponent message={"error while fetching coin Details: Please wait for a minute due to API limitations in fetching data in a minute"} />


  return (
    <Container maxW={"container.xl"}>
      {
        loading ? <Loader /> : (
          <>


            <Box width={"full"} borderWidth={1}>
              <LineChart arr={chartArray} currency={currencySymbol} days={days
              }/>
            </Box>

            {/* Buttons for chart data */}

            <HStack p={"4"}  overflowX={"auto"}>

              {
                btns.map((i)=>(
                  <Button key={i} onClick={()=>switchChartStats(i)}>{i}</Button>
                ))
              }
            </HStack>

            <RadioGroup p={"8"} value={currency} onChange={setCurrency}>
              <HStack spacing={"4"} justifyContent={"center"}>
                <Radio value={"inr"}>INR</Radio>
                <Radio value={"eur"}>EUR</Radio>
                <Radio value={"usd"}>USD</Radio>
              </HStack>
            </RadioGroup>

                            <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>

                                    <Text fontSize={"small"} alignSelf={"center"} opacity={0.7}>
                                      Last Updated On {Date(coin.market_data.last_updated).split("G")[0]}
                                    </Text>

                                    <Image src={coin.image.large} w={"16"} h={"16"} objectFit={"contain"} />

                                    <Stat>

                                          <StatLabel>{coin.name}</StatLabel>

                                          <StatNumber>{currencySymbol}{coin.market_data.current_price[currency]}</StatNumber>

                                          <StatHelpText>

                                                <StatArrow type={coin.market_data.price_change_percentage_24h > 0 ? "increase" : "decrease"} />
                                                {coin.market_data.price_change_percentage_24h}%

                                          </StatHelpText>
                                    </Stat>


                                    <Badge fontSize={"2xl"} bgColor={'whiteAlpha.700'} color={'black'}>
                                      {
                                        `#${coin.market_cap_rank}`
                                      }

                                    </Badge>


                                    <CustomBar
                                      high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
                                      low={`${currencySymbol}${coin.market_data.low_24h[currency]}`} />


                                    <Box w={"full"} p={"4"}>

                                      <Item
                                        title={"Max Supply"}
                                        value={coin.market_data.max_supply} />

                                      <Item
                                        title={"Circulating Supply"}
                                        value={coin.market_data.circulating_supply} />

                                      <Item
                                        title={"Market Cap"}
                                        value={`${currencySymbol}${coin.market_data.market_cap[currency]}`} />

                                      <Item
                                        title={"All Time Low"}
                                        value={`${currencySymbol}${coin.market_data.atl[currency]}`} />

                                      <Item
                                        title={"All Time High"}
                                        value={`${currencySymbol}${coin.market_data.ath[currency]}`} />
                                    </Box>
                            </VStack>

          </>
        )
      }

    </Container>
  )
}


const Item = ({ title, value }) => {
  return <>
    <HStack justifyContent={"space-between"} w={"full"} my={"4"}>

      <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>{title}</Text>
      <Text>{value}</Text>
    </HStack>
  </>
}


const CustomBar = ({ high, low }) => (
  <VStack w={"full"}>

    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
)

export default CoinDetails
