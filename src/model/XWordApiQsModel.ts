import { ParsedUrlQueryInput } from "querystring";

export interface XWordApiQsModel extends ParsedUrlQueryInput {
  answers: string;
  boxVal: string;
  checkPDF: string;
  chessView: string;
  clueFontSizeStep: string;
  cluesAndAnswersText: string;
  emptyBoxOpacity: string;
  encodedBoxState: string;
  gridOnly: string;
  hideClueColumns: string;
  id: string;
  isPreview: string;
  locale: string;
  print: string;
  printType: string;
  puzzleType: string;
  rtlGrid: string;
  rtlInterface: string;
  set: string;
  theme: string;
}
