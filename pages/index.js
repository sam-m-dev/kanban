import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Flex, Heading,Box} from "@chakra-ui/react";
import { DragDropContext} from "react-beautiful-dnd";
import dynamic from "next/dynamic";

// error fix column import ssr
const Column = dynamic(import("../src/components/Elements/Column"), {
  ssr: false,
});

export default function Home() {
  const [dataState, setDataState] = useState(AppData);

  //Reordering tasks inside column
  const reorderColumn = (colSource, startIndex, endIndex) => {
    const updatedTasks = Array.from(colSource.tasksList);
    const [removed] = updatedTasks.splice(startIndex, 1);

    updatedTasks.splice(endIndex, 0, removed);

    const updatedColumn = {
      ...colSource,
      tasksList: updatedTasks,
    };

    return updatedColumn;
  };

  //en drag and drop
  const onDragdEnd = (result) => {
    const { source, destination } = result;

    //If item dragged to:
    // - wrong destination
    // - same position
    // return element to its original spot

    if ((!destination) ||  (
     ( destination.droppableId === source.droppableId) &&
     ( destination.index === source.index)
    ) ){
      return;
    }


    //if order column changed update columns
    // gets the column from where the element is taken
    // and where it's dropped
    // colSrc = source column
    // cold dest= destination column;

    const colSource = dataState.kanbanCategories[source.droppableId];
    const colDest = dataState.kanbanCategories[destination.droppableId];

    if (colDest.id === colSource.id) {
      const updatedColumn = reorderColumn(
        colSource,
        source.index,
        destination.index
      );

      const updatedState = {
        ...dataState,
        kanbanCategories: {
          ...dataState.kanbanCategories,
          [updatedColumn.id]: updatedColumn,
        },
      };
      setDataState(updatedState);
      return;
    }

    //if moved to different colum
    const colFrom = Array.from(colSource.tasksList);
    const [remove] = colFrom.splice(source.index, 1);
    const newSourceCol = {
      ...colSource,
      tasksList: colFrom,
    };
    //get column destination and update it
    const finalTaskList = Array.from(colDest.tasksList);
    finalTaskList.splice(destination.index, 0, remove);

    const newDestCol = {
      ...colDest,
      tasksList: finalTaskList,
    };

    const newDataState = {
      ...dataState,
      kanbanCategories: {
        ...dataState.kanbanCategories,
        [newSourceCol.id]: newSourceCol,
        [newDestCol.id]: newDestCol,
      },
    };

    setDataState(newDataState);
  };
  return (
    <>
      <Head>
        <title>My Kanban</title>
        <meta name="description" content="Kanban Board" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* drag n drop conatiner using eautiful react dnd */}
      <DragDropContext onDragEnd={onDragdEnd}>
        <Flex flexDir="column" bg="dark" minH="100vh" w="full">
          <Heading color="white">Kanban</Heading>
          <Flex
            justify="center"
            px="2%"
            alignContent="center"
            w="100%"
            wrap="wrap"
          >
            {
              dataState.order.map((colId) => {
       
                const category = dataState.kanbanCategories[colId];
             
                const tasks = category.tasksList.map(
                  (task) => dataState.items[task]
                );
      
                return (
                  <Column key={category.id} col={category} items={tasks} />
                );
              })
            }
          </Flex>
       
        </Flex>
      </DragDropContext>
    </> 
  );
}

const AppData = {
  items: {
    1: { id: 1, title: "title 1", description: "lorem ipsum 1", progress:10},
    2: { id: 2, title: "title 2", description: "lorem ipsum 2", progress:60 },
    3: { id: 3, title: "title 3", description: "lorem ipsum 3", progress:100 },
    4: { id: 4, title: "title 4", description: "lorem ipsum 4" , progress:0 },
  },
  kanbanCategories: {
    "col-1": { id: "col-1", title: "to do", tasksList: [1, 2, 3, 4] },
    "col-2": { id: "col-2", title: "prog", tasksList: [] },
    "col-3": { id: "col-3", title: "test", tasksList: [] },
    "col-4": { id: "col-4", title: "done", tasksList: [] },
  },

  //this will facilitate the reordering otherwise
  //when trying rerender to reorder .map() will
  //throw error 

  order: ["col-1", "col-2", "col-3", "col-4"],
};
