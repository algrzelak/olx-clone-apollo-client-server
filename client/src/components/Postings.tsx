import React from "react";
import { useQuery } from "@apollo/client";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import StarIconBorder from "@material-ui/icons/StarBorder";
import { useField } from "../hooks/index";
import { GET_POSTINGS } from "../graphql/queries";
import Search from "./Search";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: "auto",
      transform: "translateZ(0)",
    },
    icon: {
      color: "white",
    },
  })
);

export default function Postings() {
  const filter = useField("search");
  const { data, loading, error } = useQuery(GET_POSTINGS, {
    variables: { title: filter.value },
  });
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Search filter={filter} />
      {!loading && !error && (
        <GridList cellHeight={200} className={classes.gridList}>
          {data.postings.map((item: any) => (
            <GridListTile key={item.id} cols={1} rows={1}>
              <img src={item.imageUrls[0] || ""} alt={item.title} />
              <GridListTileBar
                title={`$${item.price}`}
                subtitle={<span>{item.title}</span>}
                actionIcon={
                  <IconButton
                    aria-label={`follow the posting: ${item.title}`}
                    className={classes.icon}
                  >
                    <StarIconBorder />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      )}
    </div>
  );
}
