import { extendTheme, theme } from "@chakra-ui/react";

const colors = {
  
    "white": "#F1F5F2",
    "dark": "#001B2E",
    "orange":'#FFCF56',
    "light-green": '#A0E8AF',
    "green": '#3AB795'
   
};

// dark2:#011627;
//001425
//c8d5b9
// 3C6E71
// FFC100
//F96E46
//   "pink":'#AB4E68'
//   "orange":'#D64933',#FFA21F




const fonts = {
    heading: "Gloock",
    body: "Roboto Slab",
   // text: "Tilt Neon",
 text: "Roboto Slab",

    
}

export default extendTheme({
    ...theme,
    colors,
    fonts



})

