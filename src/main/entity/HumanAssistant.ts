import {
  ChildEntity,
} from 'typeorm';
import {HumanAgent} from "./HumanAgent";

@ChildEntity()
export class HumanAssistant extends HumanAgent {}
