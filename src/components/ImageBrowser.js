import React, { Component } from 'react';
import { LeftMenu, Thumbs, PhotoLoader } from '../components'
import { connect } from "react-redux";
import * as actions from "../constants/action-types";
import config from '../config';
import ReactLoading from 'react-loading';
import * as C from "../api/Common";
import { GlobalHotKeys } from "react-hotkeys";

class ImageBrowser extends Component {

  state = {};

  globalKeyHandlers = {
    NEXT_PHOTO: () => this.nextPhoto(true, "auto"),
    PREV_PHOTO: () => this.nextPhoto(false, "auto")
  };

  globalKeyMap = {
    NEXT_PHOTO: "right",
    PREV_PHOTO: "left",
  };

  // i have to keep this information, otherwise if there is error, and than in timeOut callback setState() is called, so setState throw error because component is unmounted, 
  // and errorBoundary doesn't catch error 
  _isMounted = false;

  constructor() {
    super();
    this.nextPhoto = this.nextPhoto.bind(this);
    //this.onPictureIsLoaded = this.onPictureIsLoaded.bind(this);
    this.markThumbAsSelected = this.markThumbAsSelected.bind(this);
    this.disableNavButtons = this.disableNavButtons.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadAlbum();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (this.props.album.error) {
      throw new Error(this.props.album.error);
    }
    this.loadAlbum();
  }

  loadAlbum() {
    const urlAlbum = this.getAlbumNameFromUrl(this.props);
    if (!this.props.album.error && urlAlbum !== this.props.album.name) {
      console.log(`ImageBrowser loadAlbum() -> let's get album ${urlAlbum}`)
      this.props.onSelectAlbum(urlAlbum);
    }
  }

  getAlbumNameFromUrl(props) {
    if (props.match && props.match.params && props.match.params.albumName) {
      return props.match.params.albumName;
    } else {
      return "";
    }
  }

  render() {

    const album = this.props.album;
    let imageUrl = null;
    let photoCount;
    let selectedPhotoIndex

    if (album.exists === false) {
      return (<div>Sorry, I have never been there</div>);
    }

    const albumIsReady = album.isReady === true;

    if (albumIsReady === true) {

      photoCount = album.files.length;
      selectedPhotoIndex = this.props.selectedPhotoIndex;
      const photoName = album.files[selectedPhotoIndex];
      imageUrl = `${config.imageProxyUrl}/photo/prev/${album.path}/${photoName}`;
    }

    return (

      <div ref={node => this.node = node} id="main" className="row" style={{ minHeight: "200px", width: "100%", height: "82%", maxWidth: "100%" }}>

        <GlobalHotKeys keyMap={this.globalKeyMap} handlers={this.globalKeyHandlers} />

        <div className="col-sm-2" style={{ height: "100%" }}>
          <LeftMenu cookies={this.props.cookies} />
        </div>
        <div className="container col-sm-10 noPad" style={{ height: "100%" }} >

          {(albumIsReady === true) ? (
            <div id="mainMe" style={{ height: "100%", width: "100%" }}  >

              <PhotoLoader id="loader1" imageUrl={imageUrl} disableNavButtons={this.disableNavButtons} />

              <button className="btn-img btn-nav btn-nav-left" onClick={() => { this.nextPhoto(false) }} />
              <button className="btn-img btn-nav btn-nav-right" onClick={() => { this.nextPhoto(true) }} />
              <button className="btn-img btn-fullscreen" onClick={() => { this.goToFullScreen() }} />

              <Thumbs urlPath={album.path} markThumbAsSelected={this.markThumbAsSelected} />

              <div className="top-right">{selectedPhotoIndex + 1}/{photoCount}</div>

            </div>

          ) :
            this.getLoadingDiv()
          }

        </div>
      </div >

    )
  }

  nextPhoto(forward, scrollBahaviour = null) {

    console.log("ImageBrowswer -> nextPhoto");

    const curIndex = this.props.selectedPhotoIndex;
    const album = this.props.album;
    const showOnlyFavourites = this.props.showOnlyFavourites;
    const enableNext = this.canNextPhoto(showOnlyFavourites, forward, curIndex, album);

    if (enableNext === true) {
      forward === true ? this.props.onNextPhoto() : this.props.onPrevPhoto();

      this.disableNavButtons(true);
      this.markThumbByIndexAsSelected(this.findNextPhotoIndex(album, curIndex, forward, showOnlyFavourites), true, scrollBahaviour);
      this.timeout();
    }

  }

  canNextPhoto(showOnlyFavourites, forward, curIndex, album) {
    if (showOnlyFavourites === true) {
      if ((forward === true && curIndex < (C.findLastFavouriteIndex(album))) ||
        (forward === false && C.findFirstFavouriteIndex(album) < curIndex))
        return true;
    } else {
      if ((forward === true && curIndex < (album.files.length - 1)) ||
        (forward === false && curIndex > 0))
        return true;
    }
  }

  findNextPhotoIndex(album, curIndex, forward, onlyFavourites) {
    let nextThumbIndex = (forward === true) ?
      (onlyFavourites === true) ? C.findNextFavourite(album, curIndex) : curIndex + 1
      :
      (onlyFavourites === true) ? C.findPrevFavourite(album, curIndex) : curIndex - 1;

    return nextThumbIndex;
  }

  disableNavButtons(disabled) {
    const btnNavs = this.node.querySelectorAll('.btn-nav');
    btnNavs.forEach(btn => { btn.disabled = disabled; })
  }

  markThumbByIndexAsSelected(index, scroolTo = false, scrollBahaviour = null) {
    const target = this.node.querySelector(`#imgThumb_${index}`);
    this.markThumbAsSelected(target, this.node, scroolTo, scrollBahaviour);
  }

  markThumbAsSelected(target, node, scroolTo = false, scrollbehavior) {
    const classNameForAll = target.className.replace("thumbSelected", "");
    node.querySelectorAll('.thumb').forEach(thumb => { thumb.className = classNameForAll });
    target.className += " thumbSelected";
    if (scroolTo === true) {
      //FIXME: I don't fucking understand when I use global Hotkeys (rith, left) and scroll behaviour = "smooth" scrollIntoView doesn't work, with hotkey I have to use "auto" or "instant"
      target.scrollIntoView({ behavior: scrollbehavior || "smooth", inline: "center", block: "center" });
    }
    this.disableNavButtons(true);
    this.timeout();
  }

  getLoadingDiv() {
    return (< div style={{ position: "absolute", left: "37.5%", top: "15%", height: "auto", width: "25%" }}>
      <ReactLoading type='spin' color="red" style={{ width: "100%", height: "100%" }} />
    </div>)
  }

  goToFullScreen() {
    const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

    const docElm = document.getElementById("mainMe");
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  timeout() {
    this.setState({ photoLoadingState: "started" });
    this.timer = setTimeout(() => {
      if (this.state.photoLoadingState === "started") {
        if (this._isMounted === true)
          this.setState({ photoLoadingState: "waiting" });
      }
    }, 400);
  }

}

function mapStateToProps(state, ownState) {
  return {
    album: state.selectedAlbum,
    selectedPhotoIndex: C.meOrVal(state.selectedAlbum.selectedPhotoIndex, -1),
    showOriginals: state.showOriginals,
    showOnlyFavourites: state.showOnlyFavourites,
    match: ownState.match
  };
}

function mapDispatchToProps(dispatch) {

  return {
    onNextPhoto: () => {
      dispatch({ type: actions.NEXT_PHOTO });
    },
    onPrevPhoto: () => {
      dispatch({ type: actions.PREV_PHOTO });
    },
    onSelectAlbum: (albumId) => {
      dispatch({ type: actions.GET_ALBUM, payload: { albumId } });
    },
    onResetAlbum: () => {
      dispatch({ type: actions.RESET_ALBUM });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageBrowser);
