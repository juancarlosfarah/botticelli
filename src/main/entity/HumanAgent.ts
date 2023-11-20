import {Agent} from './Agent';
import {ChildEntity, TableInheritance} from "typeorm";

@ChildEntity()
@TableInheritance({column: {type: "varchar", name: "role"}})
export class HumanAgent extends Agent {
}
