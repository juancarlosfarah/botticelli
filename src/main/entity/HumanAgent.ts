import { ChildEntity, TableInheritance } from 'typeorm';

import { Agent } from './Agent';

@ChildEntity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class HumanAgent extends Agent {}
