import { ChildEntity, TableInheritance } from 'typeorm';

import { Agent } from './Agent';

@ChildEntity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export abstract class ArtificialAgent extends Agent {}
