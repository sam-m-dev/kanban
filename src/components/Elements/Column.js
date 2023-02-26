import {
  Flex,
  Heading,
  Avatar,
  Spacer,
  Text,
  Card,
  CardBody,
  CardHeader,
  Progress,
} from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// from AppData in index
// Props
// col  to pass the KanbanCategory info to the column element
// items to pass the column tasks so we can map them and generate cards
export default function Column({ col, items }) {
  return (
    <Flex
      rounded="10px"
      width={[
        "100%", // 0-30em/ 0 to 480px
        "70%", // 30em-48em/ 480px to 767px
        "45%", // 48em-62em/7680 768px to 991px
        "23%", // 62em+
      ]}
      minH="200px"
      h="100%
    "
      flexDir="column"
      bg="orange"
      m="1%"
    >
      <Flex h="56px" align="center" justify="center" direction="column">
        <Heading fontSize="lg" letterSpacing="3px" textTransform="uppercase" color="white">
          {col.title}
        </Heading>
      </Flex>

      {/* the cards container will be the droppable element 
    where we can add the task cards */}

      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <Flex
            direction="column"
            px="1rem"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                {(provided, snapshot) => (
                  <Flex
                    key={item.id}
                    direction="column"
                    flex={1}
                    mb="1rem"
                    bg="white"
                    rounded="5px"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card variant="elevated">
                      <CardHeader borderBottom="0.5px solid lightgrey">
                        <Heading size="md" textTransform="capitalize">
                          {" "}
                          {item.title}
                        </Heading>
                      </CardHeader>

                      <CardBody>
                        <Text p="2% 0 5%">{item.description}</Text>
                        <Progress
                          alignSelf="center"
                          w="95%"
                          colorScheme="yellow"
                          bg="dark"
                          size="sm"
                          mb="5%"
                          value={`${item.progress}`}
                        />
                        <Avatar size="sm" src={item.user} />
                      </CardBody>
                    </Card>
                  </Flex>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  );
}
