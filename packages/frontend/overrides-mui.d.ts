/* eslint-disable @typescript-eslint/no-empty-interface */
import { MuiPickersOverrides } from "@material-ui/pickers/typings/overrides";

declare module "@material-ui/core/styles/overrides" {
  export interface ComponentNameToClassKey extends MuiPickersOverrides {}
}
