import { Agent } from './Agent';
import {ChildEntity, TableInheritance} from "typeorm";

@ChildEntity()
@TableInheritance({ column: { type: "varchar", name: "role" } })
export abstract class ArtificialAgent extends Agent {}
