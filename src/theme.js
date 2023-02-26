import { extendTheme, theme } from "@chakra-ui/react";

const colors = {
  
    "white": "#F1F5F2",
    "dark": "#001B2E",
    "orange":'#ffffff1A',
    "light-green": '#A0E8AF',
    "green": '#3AB795'
   
};




const fonts = {
    heading: "Gloock",
    body: "Roboto Slab",
    
}

export default extendTheme({
    ...theme,
    colors,
    fonts



})

