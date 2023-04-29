import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InfoIcon from "@material-ui/icons/Info";

// NOTE: Most of the code has been adapted from react-beautiful-dnd documentation
const useStyles = makeStyles((theme) => ({
  heading: {
    transform: "translateX(35%)",
    color: theme.palette.primary.main,
  },
  icon: {
    position: "relative",
    top: 6,
  },
}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 12;

const getItemStyle = (isDragging, draggableStyle, theme) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  position: "static",
  padding: 8 * 2,
  margin: `0 0 8px 0`,
  background: isDragging
    ? theme.palette.secondary.main
    : theme.palette.secondary.light,
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, theme) => ({
  background: isDraggingOver ? theme.palette.primary.main : "#FFF",
  padding: grid,
  width: 250,
  margin: 8,
});

export default function TemplateSelect({
  selectedSequenceTemplates,
  setSelectedSequenceTemplates,
  nonSelectedSequenceTemplates,
  setNonSelectedSequenceTemplates,
}) {
  const classes = useStyles();
  const theme = useTheme();

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */

  const getList = (id) => {
    if (id === "droppable") {
      return nonSelectedSequenceTemplates;
    } else if (id === "droppable2") {
      return selectedSequenceTemplates;
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const newItems = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === "droppable2") {
        setSelectedSequenceTemplates(newItems);
      } else {
        setNonSelectedSequenceTemplates(newItems);
      }
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setSelectedSequenceTemplates(result.droppable2);
      setNonSelectedSequenceTemplates(result.droppable);
    }
  };

  return (
    <>
      <p>
        <InfoIcon className={classes.icon} />
        Drag templates to the right in the order you want them to be sent.
      </p>
      <DragDropContext style={{ transform: "none" }} onDragEnd={onDragEnd}>
        <div style={{ display: "flex" }}>
          <div>
            <h3 className={classes.heading}>Templates</h3>
            <Droppable
              style={{ transform: "none" }}
              droppableId="droppable"
              renderClone={(provided, snapshot, rubric) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                    theme
                  )}
                >
                  {nonSelectedSequenceTemplates[rubric.source.index].name}
                </div>
              )}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver, theme)}
                >
                  {nonSelectedSequenceTemplates.map((item, index) => (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            theme
                          )}
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div>
            <h3 className={classes.heading}>Sequence</h3>
            <Droppable
              style={{ transform: "none" }}
              droppableId="droppable2"
              renderClone={(provided, snapshot, rubric) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                    theme
                  )}
                >
                  {selectedSequenceTemplates[rubric.source.index].name}
                </div>
              )}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver, theme)}
                >
                  {selectedSequenceTemplates.map((item, index) => (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            theme
                          )}
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </>
  );
}
