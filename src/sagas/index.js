import { takeLatest, call, put, all } from "redux-saga/effects";
import * as apiAlbum from "../api/Album";
import * as actions from "../constants/action-types";
import * as gqlCommands from '../api/GqlCommands';
import gql from "graphql-tag";
import { apolloClient } from '../App';

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_ALBUM, getAlbumWorker),
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
      variables: { albumName: inputAction.payload.albumId }
    })

    const album = response.data.album;

    album.files.sort();
    album.favourites.sort();

    yield put({ type: actions.toSuccessAction(actions.GET_ALBUM), data: album });

  } catch (error) {
    console.error("getAlbumWorker:", error);
    yield put({ type: actions.toErrorAction(actions.GET_ALBUM), error });
  }
}
