import React, { Component } from 'react';
import { Thumbs, PhotoLoader, ImageDetails, AlbumInfo, ImagesFilter } from '../components'
import { connect } from "react-redux";
import * as actions from "../constants/action-types";
import config from '../config';
import ReactLoading from 'react-loading';
import * as C from "../api/Common";
import { GlobalHotKeys } from "react-hotkeys";
import { getExif, formatExposureTime } from "../api/Utils";
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

  constructor() {
    super();
    this.nextPhoto = this.nextPhoto.bind(this);
    this.markThumbAsSelected = this.markThumbAsSelected.bind(this);
    this.disableNavButtons = this.disableNavButtons.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);
    this.loadExif = this.loadExif.bind(this);
    this.setNextFading = this.setNextFading.bind(this);
    this.showExif = this.showExif.bind(this);
  }

  componentDidMount() {
    this.loadAlbum();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) {

    if (this.props.album.exists === true && this.props.album.error) {
      throw new Error(this.props.album.error);
    }

    const albumNameFromUrl = this.getAlbumNameFromUrl(this.props);
    if (this.shouldLoadAlbum(prevProps, albumNameFromUrl) === true) {
      this.loadAlbum(albumNameFromUrl);
    }
  }

  loadAlbum(albumNameFromUrl) {

    if (!albumNameFromUrl) {
      albumNameFromUrl = this.getAlbumNameFromUrl(this.props);
    }

    const tags = C.getPhotoFilterTagsFromCookies(this.props.cookies);
    this.props.onSelectAlbum(albumNameFromUrl, tags);
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
    const isReloadingPhotos = album.isReloadingPhotos === true;
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

          {(albumIsReady === true && isReloadingPhotos === false) ? (

            <div id="mainMe" className="column" style={{ width: "100%", height: "100%" }}>

              {(showLeftMenu === false) ? (
                <div style={{ padding: "10px" }}>
                  <AlbumInfo />
                  <ImagesFilter cookies={this.props.cookies} />
                </div>) : null
              }

              <Swipeable onSwipedLeft={() => { this.nextPhoto(true) }} onSwipedRight={() => { this.nextPhoto(false) }} >

                <div className="row" style={{ height: '100%', width: "100%", position: "absolute", }}>
                  <div className="column" style={{ width: "100%" }}>

                    <div id="divPhotoLoaders" className="photoLoadersDiv">
                      <PhotoLoader id="loaderIn" imgId="imgPhotoIn" className={fadeInClass} display="block" key={photoUrlFadeIn} photoName={photoNameFadeIn} photoUrl={photoUrlFadeIn} onAnimationEnd={(e) => this.onAnimationEnd(e)} />
                      <PhotoLoader id="loaderOut" imgId="imgPhotoOut" className={fadeOutClass} display="block" key={photoUrlFadeOut} photoName={photoNameFadeOut} photoUrl={photoUrlFadeOut} onAnimationEnd={(e) => this.onAnimationEnd(e)} />
                      <PhotoLoader id="loaderBuffer" imgId="imgBimgPhotoBuffer" display="none" key={photoUrlBuffer} photoName={photoNameBuffer} photoUrl={photoUrlBuffer} />
                    </div>
                    <Thumbs urlPath={album.path} markThumbAsSelected={this.markThumbAsSelected} setNextFading={this.setNextFading} style={{ width: "100%" }} />
                  </div>

                  <button id="btnPrevPhoto" className="btn-nav btn-nav-left fas" tooltip="Next photo" onClick={() => { this.nextPhoto(false) }} />
                  <button id="btnNextPhoto" className="btn-nav btn-nav-right fas" tooltip="Previoius photo" onClick={() => { this.nextPhoto(true) }}></button>
                  <button className="btn-fullscreen fas" tooltip="Go to Fullscreen" onClick={() => { this.goToFullScreen() }} />

                  <div className="photoCounter">{selectedPhotoIndex + 1}/{photoCount}</div>

                  <p id="divExif" className="exif animated" style={{ display: "none" }}></p>
                  <div id="btnExif" className="btn-exif" onClick={this.showExif}>EXIF</div>

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

  showExif() {
    const divExif = this.node.querySelector("#divExif");
    const btnExif = this.node.querySelector("#btnExif");
    divExif.classList.remove("fadeIn", "fadeOut");
    divExif.innerHTML = "";
    if (divExif.style.display === "none") {
      divExif.style.display = "inline";
      btnExif.classList.add("selected");
      this.loadExif(false);
    } else {
      divExif.style.display = "none";
      btnExif.classList.remove("selected");
    }
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
      this.disableNavButtons();

      if (this.node.querySelector("#divExif").style.display !== "none") {
        this.loadExif();
      }
    }
  }

  async loadExif(fadeIn = true) {
    const img = this.node.querySelector("#loaderIn").querySelector(`#imgPhotoIn`);
    const exif = await getExif(img);

    const divExif = this.node.querySelector("#divExif");
    let exifText = "";

    if (exif.Camera) { exifText += `Camera: ${exif.Camera}<br>` }
    if (exif.Camera) { exifText += `Date: ${exif.DateTime}<br>` }
    if (exif.ExposureTime) { exifText += `Exp. Time: ${formatExposureTime(exif.ExposureTime)}s<br>` }
    if (exif.FNumber) { exifText += `FNumber: ${exif.FNumber}F<br>` }
    if (exif.ApertureValue) { exifText += `Aperture: ${exif.ApertureValue}<br>` }
    if (exif.ISOSpeedRatings) { exifText += `ISO: ${exif.ISOSpeedRatings}<br>` }

    //Not the nicest way, but when there is exif last item are very short and there is nice cascade around fullscreen button
    if (!exifText || exifText === "") exifText = "Photo has no Exif &nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;"

    divExif.innerHTML = exifText;

    if (fadeIn === true) {
      divExif.classList.remove("fadeOut");
      divExif.classList.add("fadeIn");
    }
  }

  nextPhotoByGlobalKey(forward) {
    this.nextPhoto(forward, "auto");
  }

  nextPhoto(forward, scrollBahaviour = null) {
    const curIndex = this.props.selectedPhotoIndex;
    const album = this.props.album;
    const enableNext = this.canNextPhoto(forward, curIndex, album);

    if (enableNext === true) {
      forward === true ? this.props.onNextPhoto() : this.props.onPrevPhoto();
      this.setState({ animating: true, movementDirection: forward === true ? "next" : "prev" });
      this.disableNavButtons();
      this.markThumbByIndexAsSelected(this.findNextPhotoIndex(album, curIndex, forward), true, scrollBahaviour);
    }

    const divExif = this.node.querySelector("#divExif");
    divExif.classList.remove("fadeIn")
    divExif.classList.add("fadeOut")

  }

  canNextPhoto(forward, curIndex, album) {
    if ((forward === true && curIndex < (album.files.length - 1)) ||
      (forward === false && curIndex > 0))
      return true;
  }

  findNextPhotoIndex(album, curIndex, forward) {
    let nextThumbIndex = (forward === true) ?
      curIndex + 1
      :
      curIndex - 1;

    return nextThumbIndex;
  }

  disableNavButtons() {
    const curIndex = this.props.selectedPhotoIndex;
    const album = this.props.album;

    this.node.querySelector(`#btnNextPhoto`).disabled = !this.canNextPhoto(true, curIndex, album);
    this.node.querySelector(`#btnPrevPhoto`).disabled = !this.canNextPhoto(false, curIndex, album);
  }

  markThumbByIndexAsSelected(index, scroolTo = false, scrollBahaviour = null) {
    const target = this.node.querySelector(`#thumbObsv${index}`);
    this.markThumbAsSelected(target, this.node, scroolTo, scrollBahaviour);
  }

  setNextFading() {
    this.setState({ movementDirection: "thumbClick", lastIndex: this.props.selectedPhotoIndex });
  }

  markThumbAsSelected(target, node, scroolTo = false, scrollbehavior) {
    node.querySelectorAll('.thumbSelected').forEach(thumb => { thumb.classList.remove("thumbSelected") });

    // find componnet which is displayed (loader, image, error message), on that compoment i can aply selected border
    for (let i = 0; i < target.children.length; i++) {
      if (target.children[i].style.display !== "none") {
        target = target.children[i];
        break;
      }
    }

    target.classList.add("thumbSelected");
    if (scroolTo === true) {
      //FIXME: I don't fucking understand when I use global Hotkeys (rith, left) and scroll behaviour = "smooth" scrollIntoView doesn't work, with hotkey I have to use "auto" or "instant"
      target.scrollIntoView({ behavior: scrollbehavior || "smooth", inline: "center", block: "center" });
    }
    this.disableNavButtons();
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
    selectedFilterTags: state.selectedFilterTags,
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
    onSelectAlbum: (albumId, tags) => {
      dispatch({ type: actions.GET_ALBUM, payload: { albumId, tags: tags } });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageBrowser);
