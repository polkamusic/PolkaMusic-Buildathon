import React from "react";
import { Flex } from "@chakra-ui/react";
import SideBar from "./sidebar/SideBar";
import { Switch, Route, Link } from "react-router-dom";
import Albums from "./main/library/Albums";
import Artists from "./main/library/Artists";
import Playlist from "./main/library/Playlist";
import Songs from "./main/library/Songs";
import NFT from "./main/library/NFT";

import Browse from "./main/discover/Browse";
import Favorite from "./main/discover/Favorite";
import Radio from "./main/discover/Radio";
import Store from "./main/discover/Store";
import MusicPlayer from "./main/MusicPlayer";

function Main(props) {
  return (
    <Flex
      width="100vw"
      height="100vh"
      maxHeight="100vh"
      flexDirection="row"
      pos="relative"
      bg="black"
    >
      <SideBar />
      <Switch>
        <Route exact path="/lib/albums">
          <Albums />
        </Route>
        <Route exact path="/lib/artists">
          <Artists />
        </Route>
        <Route exact path="/lib/playlist">
          <Playlist />
        </Route>
        <Route exact path="/lib/songs">
          <Songs />
        </Route>
        <Route exact path="/lib/NFT">
          <NFT />
        </Route>
        <Route exact path="/dis/browse">
          <Browse />
        </Route>
        <Route exact path="/dis/favorite">
          <Favorite />
        </Route>
        <Route exact path="/dis/radio">
          <Radio />
        </Route>
        <Route exact path="/dis/store">
          <Store />
        </Route>
      </Switch>
      <MusicPlayer />
    </Flex>
  );
}

export default Main;
