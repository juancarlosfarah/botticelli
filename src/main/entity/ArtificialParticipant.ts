import { ChildEntity } from 'typeorm';

import { ArtificialAgent } from './ArtificialAgent';

@ChildEntity()
export class ArtificialParticipant extends ArtificialAgent {}
