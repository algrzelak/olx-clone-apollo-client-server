import React from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import StarIconBorder from "@material-ui/icons/StarBorder";
import { Star } from "@material-ui/icons";
import { Link } from "react-router-dom";
import LaunchIcon from "@material-ui/icons/Launch";
import { useField } from "../hooks";
import {
  FOLLOW_POSTING,
  GET_ALL_POSTINGS,
  GET_CURRENT_USER_FOLLOWED_POSTINGS_IDS,
} from "../graphql/queries";
import Search from "../components/Search";

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
      color: "gold",
    },
    launch: {
      color: "deepskyblue",
    },
  })
);

export default function AllPostings() {
  const classes = useStyles();
  const filter = useField("search");
  const client = useApolloClient();
  const { data: postingsData, loading: postingsLoading } = useQuery(
    GET_ALL_POSTINGS,
    {
      onError: (error) => {
        console.log(error.graphQLErrors[0].message);
      },
    }
  );

  const { data: followedData, loading: followedLoading } = useQuery(
    GET_CURRENT_USER_FOLLOWED_POSTINGS_IDS,
    {
      onError: (error) => {
        console.log(error.graphQLErrors[0].message);
      },
    }
  );

  const [followPosting] = useMutation(FOLLOW_POSTING, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  if (postingsLoading || followedLoading) return <div>loading</div>;
  const followedPostingsIds = followedData.currentUserFollowedPostings.map(
    (posting: any) => posting.id
  );

  const postings = postingsData.allPostings;

  async function handleFollow(id: string) {
    await followPosting({ variables: { id } });
    await client.resetStore();
  }

  return (
    <div className={classes.root}>
      <Search filter={filter} />
      <GridList cellHeight={200} className={classes.gridList}>
        {postings.map((item: any) => (
          <GridListTile key={item.id} cols={1} rows={1}>
            <img src={item.imageUrls[0] || ""} alt={item.title} />
            <GridListTileBar
              title={`$${item.price}`}
              subtitle={<span>{item.title}</span>}
              actionIcon={
                <div>
                  <IconButton
                    className={classes.launch}
                    aria-label={`open the posting: ${item.title}`}
                    component={Link}
                    to={`/posting/${item.id}`}
                  >
                    <LaunchIcon />
                  </IconButton>
                  <IconButton
                    aria-label={`follow the posting: ${item.title}`}
                    className={classes.icon}
                    onClick={() => handleFollow(item.id)}
                  >
                    {followedPostingsIds.includes(item.id) ? (
                      <Star />
                    ) : (
                      <StarIconBorder />
                    )}
                  </IconButton>
                </div>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
