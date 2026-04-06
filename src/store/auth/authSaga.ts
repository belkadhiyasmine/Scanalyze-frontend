import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "./authSlice";

function* handleLogin(action: ReturnType<typeof loginRequest>): Generator {
  try {
    // TODO : remplacer par le vrai appel API
    // const response: any = yield call(
    //   axios.post,
    //   "http://localhost:8000/api/auth/login",
    //   action.payload
    // );

    // Simulation temporaire
    yield call(() => new Promise((res) => setTimeout(res, 1000)));
    const response = {
      data: {
        token:    "demo-token",
        userName: "John Doe",
        userRole: "Admin",
      },
    };

    localStorage.setItem("token",    response.data.token);
    localStorage.setItem("userName", response.data.userName);
    localStorage.setItem("userRole", response.data.userRole);

    yield put(loginSuccess(response.data));

  } catch (err: any) {
    yield put(loginFailure("Email ou mot de passe incorrect."));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}