import { query_config, send_transaction, query_state } from './rpc';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const SERVER_TICK_TO_SECOND = 5;

interface SendTransactionRes {
    success: boolean;
    jobid: string | undefined;
}

interface SendTransactionParams {
    cmd: Array<bigint>;
    prikey: string;
}

interface QueryStateRes {
    player: any;
    playerList: any;
    globalTimer: any;
}

interface QueryStateParams {
    cmd: Array<bigint>;
    prikey: string;
}

export const getConfig = createAsyncThunk(
    'client/getConfig',
    async () => {
        const res = await query_config();
        const data = JSON.parse(res.data);
        return data;
    }
)

export const sendTransaction = createAsyncThunk<
    SendTransactionRes,
    SendTransactionParams,
    { rejectValue: string }
    >(
        'client/sendTransaction',
        async (params: {cmd: Array<bigint>, prikey: string }, { rejectWithValue }) => {
            try {
                const { cmd, prikey } = params;
                const res = await send_transaction(cmd, prikey);
                return res;
            } catch (err: any) {
                return rejectWithValue(err);
            }
        }
);

export const queryState = createAsyncThunk<
    QueryStateRes,
    QueryStateParams,
    { rejectValue: string }
    >(
        'client/queryState',
        async (params: {cmd: Array<bigint>, prikey: string }, { rejectWithValue }) => {
            try {
                const { cmd, prikey } = params;
                const res = await query_state(cmd, prikey);
                const datas = JSON.parse(res.data);
                console.log("query state data", datas.data);

                const player = datas[0];
                const playerList = datas[1];
                const counter = datas[2];
                return {
                    player,
                    playerList,
                    globalTimer: counter * SERVER_TICK_TO_SECOND,
                };
            } catch (err: any) {
                return rejectWithValue(err);
            }
        }
);