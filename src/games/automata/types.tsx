export interface Modifier {
  delay: number;
  entity: Array<number>;
  local: Array<number>;
  name: string;
}

export class ExternalState {
  selectedCreatureIndex: number | null;
  userActivity: "browsing" | "creating" | "rebooting" | "loading";
  // idle -> queryingUpdate, queryingUpdate -> moniteringResut, moniteringResut-> queryingUpdate
  viewerActivity:
    | "monitoringResult"
    | "queryingUpdate"
    | "idle"
    | "queryConfig";
  errorMessage: string;

  constructor() {
    this.selectedCreatureIndex = null;
    (this.userActivity = "loading"),
      (this.viewerActivity = "idle"),
      (this.errorMessage = "");
  }

  isMonitorResult() {
    return this.viewerActivity == "monitoringResult";
  }

  hasError() {
    return this.errorMessage != "";
  }

  getSelectedIndex(): number | null {
    return this.selectedCreatureIndex;
  }
}

export interface SendTransactionRes {
  success: boolean;
  jobid: string | undefined;
}

export interface SendTransactionParams {
  cmd: Array<bigint>;
  prikey: string;
}