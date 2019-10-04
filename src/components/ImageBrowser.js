import React, { Component } from 'react';
import { LeftMenu, Thumbs, PhotoLoader, ImageDetails, AlbumInfo, ImagesFilter } from '../components'
import { connect } from "react-redux";
import * as actions from "../constants/action-types";
import config from '../config';
import ReactLoading from 'react-loading';
import * as C from "../api/Common";
import { GlobalHotKeys } from "react-hotkeys";
import { getExif } from "../api/Utils";
import { Swipeable } from 'react-swipeable'

class ImageBrowser extends Component {

  state = { animating: false, movementDirection: "start", lastIndex: -1 };

  globalKeyHandlers = {
    NEXT_PHOTO: () => this.nextPhotoByGlobalKey(true),
    PREV_PHOTO: () => this.nextPhotoByGlobalKey(false)
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
    this.markThumbAsSelected = this.markThumbAsSelected.bind(this);
    this.disableNavButtons = this.disableNavButtons.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
    this.loadExif = this.loadExif.bind(this);
    this.setNextFading = this.setNextFading.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    const albumNameFromUrl = this.getAlbumNameFromUrl(this.props);
    this.props.onSelectAlbum(albumNameFromUrl);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) {

    if (this.props.album.exists === true && this.props.album.error) {
      throw new Error(this.props.album.error);
    }

    const albumNameFromUrl = this.getAlbumNameFromUrl(this.props);
    if (this.shouldLoadAlbum(prevProps, albumNameFromUrl) === true) {
      this.props.onSelectAlbum(albumNameFromUrl);
    }
  }

  shouldLoadAlbum(prevProps, albumNameFromUrl) {

    const album = this.props.album;

    if (album.isFetching === true) {
      return false;
    }

    //if is loaded and name of current album is the same as album name in url, than don't load
    if (album.isReady === true && album.name === albumNameFromUrl) {
      return false;
    }

    //check situation when user had erorr i.e. abount "not visited place (I've never been there)" and than choose in menu new country
    if (album.isReady === true && album.error && albumNameFromUrl === this.getAlbumNameFromUrl(prevProps)) {
      return false;
    }

    return true;
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

    if (album.isReady === true && album.exists === false) {
      return (<div>Sorry, I have never been there</div>);
    }

    const photoCount = (album.files) ? album.files.length : 0;
    const selectedPhotoIndex = this.props.selectedPhotoIndex
    const albumIsReady = album.isReady === true;
    const movementDirection = this.state.movementDirection;
    const { photoUrlFadeIn, photoUrlFadeOut, photoUrlBuffer, photoNameFadeIn, photoNameFadeOut, photoNameBuffer } = this.getPhotoUrlsAndNames(album, selectedPhotoIndex, movementDirection);
    const { fadeInClass, fadeOutClass } = this.getPhotoFadingClasses(selectedPhotoIndex, movementDirection)

    const showLeftMenu = this.props.styles.showLeftMenu === true;

    return (

      <div id="divBrowswerTop" ref={node => this.node = node} className="row" style={{ height: 'calc(100% - 80px)', maxWidth: "100%" }} >

        <GlobalHotKeys keyMap={this.globalKeyMap} handlers={this.globalKeyHandlers} />

        {(showLeftMenu === true) ?
          <div className="col-sm-2" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "auto", overflowX: "hidden" }} >
            <AlbumInfo />
            <ImagesFilter cookies={this.props.cookies} />
            <ImageDetails />
          </div>
          : null
        }

        <div className={showLeftMenu ? "col-sm-10" : "col-sm-12"} style={{ padding: "0" }}>

          {(albumIsReady === true) ? (

            <div id="mainMe" className="column" style={{ width: "100%", height: "100%" }}>

              {(showLeftMenu === false) ? (
                <div style={{ padding: "10px" }}>
                  <AlbumInfo />
                  <ImagesFilter cookies={this.props.cookies} />
                </div>) : null
              }

              <Swipeable onSwipedLeft={() => { this.nextPhoto(true) }} onSwipedRight={() => { this.nextPhoto(false) }} >

                <div className="row" style={{ height: '100%', width: "100%", position: "absolute", }}>
                  <div className="column" style={{ width: "100%", padding: "var(--baseSpace)" }}>

                    <div id="divPhotoLoaders" style={{ width: "100%", height: "calc(100% - var(--thumbsHeight) - var(--baseSpace))", minHeight: "60vh", position: "relative", overflow: "hidden", marginBottom: "5px" }}>
                      <PhotoLoader id="loaderIn" imgId="imgPhotoIn" className={fadeInClass} display="block" key={photoUrlFadeIn} photoName={photoNameFadeIn} photoUrl={photoUrlFadeIn} onAnimationEnd={(e) => this.onAnimationEnd(e)} />
                      <PhotoLoader id="loaderOut" imgId="imgPhotoOut" className={fadeOutClass} display="block" key={photoUrlFadeOut} photoName={photoNameFadeOut} photoUrl={photoUrlFadeOut} onAnimationEnd={(e) => this.onAnimationEnd(e)} />
                      <PhotoLoader id="loaderBuffer" imgId="imgBimgPhotoBuffer" display="none" key={photoUrlBuffer} photoName={photoNameBuffer} photoUrl={photoUrlBuffer} />
                    </div>
                    <Thumbs urlPath={album.path} markThumbAsSelected={this.markThumbAsSelected} setNextFading={this.setNextFading} style={{ width: "100%" }} />
                  </div>

                  <button id="btnPrevPhoto" className="btn-img btn-nav btn-nav-left" onClick={() => { this.nextPhoto(false) }} />
                  <button id="btnNextPhoto" className="btn-img btn-nav btn-nav-right" onClick={() => { this.nextPhoto(true) }} />
                  <button className="btn-img btn-fullscreen" onClick={() => { this.goToFullScreen() }} />
                  <div className="top-right">{selectedPhotoIndex + 1}/{photoCount}</div>
                </div>
              </Swipeable>
            </div>
          ) :
            this.getLoadingDiv()
          }

        </div>
      </div >

    )
  }

  getPhotoFadingClasses(selectedPhotoIndex, movementDirection) {
    const usePulseFading = (selectedPhotoIndex === 0 && movementDirection === "start") || movementDirection === "thumbClick";
    const fadeOutClass = usePulseFading === true ? "fadeOut" : (movementDirection === "next" ? "fadeOutLeft" : "fadeOutRight");
    const fadeInClass = usePulseFading === true ? "fadeIn" : (movementDirection === "next" ? "fadeInRight" : "fadeInLeft");

    return { fadeInClass, fadeOutClass };
  }

  getPhotoUrlsAndNames(album, selectedPhotoIndex, movementDirection) {

    if (album.isReady !== true) {
      return {}
    }

    let photoUrlFadeIn = null, photoUrlFadeOut = null, photoUrlBuffer = null;
    let photoNameFadeIn = null, photoNameFadeOut = null, photoNameBuffer = null;

    photoNameFadeIn = album.files[selectedPhotoIndex];

    const photoNameNext = selectedPhotoIndex + 1 < album.files.length ? album.files[selectedPhotoIndex + 1] : '';
    const photoNamePrev = selectedPhotoIndex > 0 ? album.files[(movementDirection === "thumbClick") ? this.state.lastIndex : selectedPhotoIndex - 1] : '';

    photoUrlFadeIn = `${config.imageProxyUrl}/photo/prev/${album.path}/${photoNameFadeIn}`;
    const photoUrlNext = selectedPhotoIndex + 1 < album.files.length ? `${config.imageProxyUrl}/photo/prev/${album.path}/${photoNameNext}` : '';
    const photoUrlPrev = selectedPhotoIndex > 0 ? `${config.imageProxyUrl}/photo/prev/${album.path}/${photoNamePrev}` : '';

    if (movementDirection === "prev") {
      photoUrlFadeOut = photoUrlNext;
      photoNameFadeOut = photoNameNext;
      photoUrlBuffer = photoUrlPrev;
      photoNameBuffer = photoNamePrev
    } else {
      photoUrlFadeOut = photoUrlPrev;
      photoNameFadeOut = photoNamePrev;
      photoUrlBuffer = photoUrlNext;
      photoNameBuffer = photoNameNext
    }

    return {
      photoNameFadeIn, photoUrlFadeIn, photoUrlFadeOut, photoNameFadeOut, photoNameBuffer, photoUrlBuffer
    }

  }

  async onAnimationEnd(e) {
    if (e.target.id === "loaderOut") {
      this.setState({ animating: false });
    }

    if (e.target.id === "loaderIn") {
      this.disableNavButtons(false);
      this.loadExif();
    }
  }

  async loadExif() {
    const img = this.node.querySelector("#loaderIn").querySelector(`#imgPhotoIn`);
    const exif = await getExif(img);
    this.props.onLoadExif(exif);
  }

  nextPhotoByGlobalKey(forward) {
    this.nextPhoto(forward, "auto");
  }

  nextPhoto(forward, scrollBahaviour = null) {

    if (this.state.animating === true) {
      return;
    }

    const curIndex = this.props.selectedPhotoIndex;
    const album = this.props.album;
    const showOnlyFavourites = this.props.showOnlyFavourites;
    const enableNext = this.canNextPhoto(showOnlyFavourites, forward, curIndex, album);

    if (enableNext === true) {
      forward === true ? this.props.onNextPhoto() : this.props.onPrevPhoto();
      this.setState({ animating: true, movementDirection: forward === true ? "next" : "prev" });
      this.disableNavButtons(true);
      this.markThumbByIndexAsSelected(this.findNextPhotoIndex(album, curIndex, forward, showOnlyFavourites), true, scrollBahaviour);
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



    if (disabled === true) {
      const btnNavs = this.node.querySelectorAll('.btn-nav');
      btnNavs.forEach(btn => { btn.disabled = true; })
    } else {
      const curIndex = this.props.selectedPhotoIndex;
      const album = this.props.album;
      const showOnlyFavourites = this.props.showOnlyFavourites;

      this.node.querySelector(`#btnNextPhoto`).disabled = !this.canNextPhoto(showOnlyFavourites, true, curIndex, album);
      this.node.querySelector(`#btnPrevPhoto`).disabled = !this.canNextPhoto(showOnlyFavourites, false, curIndex, album);
    }
  }

  markThumbByIndexAsSelected(index, scroolTo = false, scrollBahaviour = null) {
    const target = this.node.querySelector(`#imgThumb_${index}`);
    this.markThumbAsSelected(target, this.node, scroolTo, scrollBahaviour);
  }

  setNextFading() {
    this.setState({ movementDirection: "thumbClick", lastIndex: this.props.selectedPhotoIndex });

  }

  markThumbAsSelected(target, node, scroolTo = false, scrollbehavior) {
    node.querySelectorAll('.thumbSelected').forEach(thumb => { thumb.classList.remove("thumbSelected") });

    target.classList.add("thumbSelected");
    if (scroolTo === true) {
      //FIXME: I don't fucking understand when I use global Hotkeys (rith, left) and scroll behaviour = "smooth" scrollIntoView doesn't work, with hotkey I have to use "auto" or "instant"
      target.scrollIntoView({ behavior: scrollbehavior || "smooth", inline: "center", block: "center" });
    }
    this.disableNavButtons(true);
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

    const docElm = this.node.querySelector("#divPhotoLoaders");
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
    },
    onLoadExif: (exif) => {
      dispatch({ type: actions.LOAD_EXIF, payload: { exif } });
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageBrowser);
