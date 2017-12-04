/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}


// Fix for bad TS typing for FileReader types
interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}
// end fix

interface EmittedEvent {
  data: any;
  type: string;
}
