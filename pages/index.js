import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Flex, Heading, Box, Text, Divider } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import dynamic from "next/dynamic";

// error fix column import ssr
const Column = dynamic(import("../src/components/Elements/Column"), {
  ssr: false,
});

export default function Home() {
  const [dataState, setDataState] = useState(AppData);
  const current = new Date().toLocaleString("en-us", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const date = `${current}`;

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

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
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
        <Flex
          flexDir="column"
          bgGradient="linear(to-l, #44A08D,  #093637)"
          minH="100vh"
          w="full"
        >
          <Flex justifyContent="space-between" p="1% 2%" alignItems="center">
            <Heading color="white" fontSize="4xl">
              Kanban{" "}
            </Heading>
            <Heading color="white" fontSize="lg">
              {date}
            </Heading>
          </Flex>
          <Divider orientation="horizontal" />
          <Flex
            justify="center"
            p="5%"
            alignContent="center"
            w="100%"
            wrap="wrap"
          >
            {dataState.order.map((colId) => {
              const category = dataState.kanbanCategories[colId];

              const tasks = category.tasksList.map(
                (task) => dataState.items[task]
              );

              return <Column key={category.id} col={category} items={tasks} />;
            })}
          </Flex>
        </Flex>
      </DragDropContext>
    </>
  );
}

const AppData = {
  items: {
    1: {
      id: 1,
      title: "Task Name One",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      progress: 10,
      user: "https://i.pravatar.cc/150?img=68",
    },
    2: {
      id: 2,
      title: "Task Name Two",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      progress: 60,
      user: "https://i.pravatar.cc/150?img=49",
    },
    3: {
      id: 3,
      title: "Task Name three",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      progress: 100,
      user: "https://i.pravatar.cc/150?img=60",
    },
    4: {
      id: 4,
      title: "Task Name four",
      description: "Excepteur sint occaecat cupidatat non proident.",
      progress: 0,
      user: "",
    },
        5: {
      id: 5,
      title: "Task Name five",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      progress: 60,
      user: "https://i.pravatar.cc/150?img=49",
    },
    6: {
      id: 6,
      title: "Task Name six",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      progress: 90,
      user: "https://i.pravatar.cc/150?img=60",
    },
    7: {
      id: 7,
      title: "Task Name seven",
      description: "Excepteur sint occaecat cupidatat non proident.",
      progress: 0,
      user: "",
    },
  },
  kanbanCategories: {
    "col-1": { id: "col-1", title: "to do", tasksList: [4,7] },
    "col-2": { id: "col-2", title: "in progress", tasksList: [1, 2] },
    "col-3": { id: "col-3", title: "testing", tasksList: [5,6] },
    "col-4": { id: "col-4", title: "done", tasksList: [3] },
  },

  //this will facilitate the reordering otherwise
  //when trying rerender to reorder .map() will
  //throw error

  order: ["col-1", "col-2", "col-3", "col-4"],
};
