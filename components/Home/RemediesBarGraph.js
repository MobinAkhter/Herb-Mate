import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Button from "../ui/Button";
import { useState, useEffect } from "react";

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from 'react-native-chart-kit'

function RemediesBarGraph(){
    // contains arrays where each instance has remedy name and its bookmark count
    dataset = [["Angelica", 23], ["Boswellia", 26], ["Buchu", 0], ["Calendula", 6], ["Chrysanthemum", 43], 
           ["Cramp Bark", 14], ["Dragon", 33], ["Eucalyptus", 45], ["Feverfew", 29], ["Gentian", 3], 
           ["Ginseng", 36], ["Hawthorn", 50], ["Horse Chestnut", 44], ["Hyssop", 37], ["Juniper", 25], 
           ["Kava Kava", 41], ["Lavender", 27], ["Motherwort", 19], ["Mullein", 9], ["undefined", 40], 
           ["Passionflower", 36], ["Rehmannia", 17], ["Rhubarb", 24], ["Saffron", 11], ["Saw Palmetto", 31], 
           ["Slippery Elm", 48], ["Tumeric", 30], ["Valerian", 35], ["Yarrow", 19]]
    

   const [remedy1, setRemedy1] = useState("");
   const [remedy2, setRemedy2] = useState("");
   const [remedy3, setRemedy3] = useState("");
   const [remedy4, setRemedy4] = useState("");
   const [remedy5, setRemedy5] = useState("");


   const chartConfig = {
    backgroundGradientFrom: '#fff', // white background
    backgroundGradientTo: '#fff', // white background
    decimalPlaces: 0, // Hide decimals in the y-axis labels
    color: (opacity = 0) => "#FFFFFF", // blue color for bars
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // black color for labels
  };

   const barData = {
      datasets: [
        
        {
          data: [ remedy1, remedy2, remedy3, remedy4, remedy5],
          colors: [
            (opacity = 1) => "#01FD1A",
            (opacity = 1) => "#1F51FF",
            (opacity = 1) => "#FD0131",
            (opacity = 1) => "#FD6101",
            (opacity = 1) => "#6D01FD",
            
          ]
        },
      ],
    };

    useEffect(() => {
        setRemedy1(dataset[0][1])
        setRemedy2(dataset[1][1])
        setRemedy3(dataset[5][1])
        setRemedy4(dataset[10][1])
        setRemedy5(dataset[4][1])
      })

      /**
       * 
       * <TextInput placeholder="Enter Remedy 1"
                    onChangeText={remedy1}>
        </TextInput>

        <TextInput placeholder="Enter Remedy 2">

        </TextInput>

        <TextInput placeholder="Enter Remedy 3">

        </TextInput>

        <TextInput placeholder="Enter Remedy 4">

        </TextInput>

        <TextInput placeholder="Enter Remedy 5">

        </TextInput>
       */
    

    return(
        <>
        <Text> Bar Graph</Text>

        

        <BarChart
       
        data={barData}
        width={390}
        height={450}
        fromZero={true}
        chartConfig={chartConfig}
        style={{ marginVertical: 8, borderRadius: 16 }}
        withCustomBarColorFromData = {true}
        flatColor = {true}
        showBarTops ={false}
        showValuesOnTopOfBars={true}
      />
        
        </>
    )
}

export default RemediesBarGraph;