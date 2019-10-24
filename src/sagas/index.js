import { takeLatest, call, put, all } from "redux-saga/effects";
import * as apiAlbum from "../api/Album";
import * as actions from "../constants/action-types";
import * as gqlCommands from '../api/GqlCommands';
import gql from "graphql-tag";
import { apolloClient } from '../App';

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_ALBUM, getAlbumWorker),
    takeLatest(actions.FILTER_ALBUM_PHOTOS, filterAlbumPhotos),
    takeLatest(actions.LOGIN, getLoginWorker)
  ]);
}

export function* getLoginWorker(inputAction) {
  try {
    const response = yield call(apiAlbum.postLogin, inputAction.payload.email, inputAction.payload.password);
    const data = response.data.data;
    yield put({ type: actions.toSuccessAction(actions.LOGIN), data: data.token });
  } catch (error) {
    console.error("getLoginWorker" + error);
    yield put({ type: actions.toErrorAction(actions.LOGIN) });
  }
}

function* getAlbumWorker(inputAction) {
  try {
    const response = yield apolloClient.query({
      query: gql`${gqlCommands.GET_ALBUM}`,
      fetchPolicy: "network-only",
      variables: { albumName: inputAction.payload.albumId, tags: inputAction.payload.tags }
    })

    const album = response.data.album;

    album.files = response.data.photosByTags;
    album.files.sort();

    yield put({ type: actions.toSuccessAction(actions.GET_ALBUM), data: album });

  } catch (error) {
    console.error("getAlbumWorker:", error);
    yield put({ type: actions.toErrorAction(actions.GET_ALBUM), error });
  }
}

function* filterAlbumPhotos(inputAction) {
  try {
    const response = yield apolloClient.query({
      query: gql`${gqlCommands.GET_ALBUM_PHOTOS}`,
      fetchPolicy: "network-only",
      variables: { albumName: inputAction.payload.albumName, tags: inputAction.payload.tags }
    })

    const photos = response.data.photosByTags;

    yield put({ type: actions.toSuccessAction(actions.FILTER_ALBUM_PHOTOS), data: photos });

  } catch (error) {
    console.error("getAlbumWorker:", error);
    yield put({ type: actions.toErrorAction(actions.FILTER_ALBUM_PHOTOS), error });
  }
}
