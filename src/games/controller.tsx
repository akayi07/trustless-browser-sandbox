import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { Container, Row } from "react-bootstrap";
import { ClipRect, Clip, getBeat} from "./draw";
import { loadAudio2, loadAudio, AnalyserInfo, audioSystem} from "./audio";
import { scenario } from "./scenario";
import { getConfig, sendTransaction, queryState } from "./request";
import { UIState, selectUIState, setUIState, selectNonce } from "../data/puppy_party/properties";
import { getTransactionCommandArray } from "./rpc";
import { selectL2Account, selectL1Account, loginL2AccountAsync, loginL1AccountAsync } from "../data/accountSlice";
import "./style.scss";

//import cover from "./images/towerdefence.jpg";

const SWAY = 0n;
const CREATE_PLAYER = 1n;
const SHAKE_FEET = 2n;
const JUMP = 3n;
const SHAKE_HEADS = 4n;
const POST_COMMENTS = 5n;
const LOTTERY = 6n;

const progress = 0.001;

function draw(): void {
  const analyserInfo = audioSystem.play();
  if (scenario.status == "play" && analyserInfo!=null) {
      const ratioArray = getBeat(analyserInfo!);
      scenario.draw(ratioArray, {progress: progress});
      scenario.step(ratioArray);
  }
}

// Set the interval
const intervalId = setInterval(draw, 100); // 1000ms = 1 second

export function GameController() {
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(selectL2Account);
  const uIState = useAppSelector(selectUIState);
  const [inc, setInc] = useState(0);
  const nonce = useAppSelector(selectNonce);

  function createPlayer() {
    try {
      dispatch(
        sendTransaction({
          cmd: getTransactionCommandArray(CREATE_PLAYER, nonce),
          prikey: l2account!.address,
        })
      );
    } catch (e) {
      console.log("Error at create player " + e);
    }
  }

  function updateState() {
    if (uIState >= UIState.Idle) {
      dispatch(queryState({ cmd: [], prikey: l2account!.address }));
    }
    setInc(inc + 1);
  }

  function loginProcess() {
    if (uIState == UIState.QueryConfig) {
      dispatch(getConfig());
    } else if (uIState == UIState.QueryState) {
      dispatch(queryState({ cmd: [], prikey: l2account!.address }));
    } else if (uIState == UIState.CreatePlayer) {
      createPlayer();
    }
  }

  useEffect(() => {
    loginProcess();
  }, [uIState]);

  useEffect(() => {
    if (l2account) {
      scenario.status = "play";
      console.log(l2account);

      if (uIState == UIState.Init) {
        dispatch(setUIState({ uIState: UIState.QueryConfig }));
      }
    }
  }, [l2account]);

  useEffect(() => {
     dispatch(loginL1AccountAsync());
  }, []);

  useEffect(() => {
    setTimeout(() => {
      updateState();
    }, 5000);
  }, [inc]);

  const account = useAppSelector(selectL1Account);
  console.log("l1 account:", account);

  function handleDiscoShakeFeet() {
    dispatch(
      sendTransaction({
        cmd: getTransactionCommandArray(SHAKE_FEET, nonce),
        prikey: l2account!.address,
      })
    );
    dispatch(queryState({ cmd: [], prikey: l2account!.address }));
  }

  function handleDiscoJump() {
    dispatch(
      sendTransaction({
        cmd: getTransactionCommandArray(JUMP, nonce),
        prikey: l2account!.address,
      })
    );
    dispatch(queryState({ cmd: [], prikey: l2account!.address }));
  }

  function handleDiscoShakeHeads() {
    dispatch(
      sendTransaction({
        cmd: getTransactionCommandArray(SHAKE_HEADS, nonce),
        prikey: l2account!.address,
      })
    );
    dispatch(queryState({ cmd: [], prikey: l2account!.address }));
  }

  function handleDiscoPostComments() {
    dispatch(
      sendTransaction({
        cmd: getTransactionCommandArray(POST_COMMENTS, nonce),
        prikey: l2account!.address,
      })
    );
    dispatch(queryState({ cmd: [], prikey: l2account!.address }));
  }

  return (
    <>
      {!l2account && account &&
      <div className="center" id="stage">
        <Container className="mt-5">
            <button className="btn btn-confirm mb-5"
              onClick={() => {
                dispatch(loginL2AccountAsync(account!))
                loadAudio((ele) => {return ele;});
              }}
            > Current Party: BOX DEMO, 4 music, 1000000 Drops of token APCY </button>
            <button className="btn btn-confirm mb-5"
              onClick={() => {
                dispatch(loginL2AccountAsync(account!))
                loadAudio2((ele) => {return ele;});
              }}
            > Current Party: BOX DEMO, 4 music, 1000000 Drops of token APCY </button>
            <button className="btn btn-confirm mb-5"
            > Coming Soon: BOX DEMO2 [2024/8/39:22:00], 4 music, 1000000 Drops of token APCY </button>
        </Container>
      </div>
      }
      {l2account &&
        <div className="center" id="stage">
          <canvas id="canvas"></canvas>
          <div className="stage-buttons">
            <div className="button1" onClick={handleDiscoShakeFeet}></div>
            <div className="button2" onClick={handleDiscoJump}></div>
            <div className="button3" onClick={handleDiscoShakeHeads}></div>
            <div className="button4" onClick={handleDiscoPostComments}></div>
          </div>
        </div>
      }
    </>
  );
}
