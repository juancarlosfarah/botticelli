import { ChildEntity } from 'typeorm';

import { ArtificialAgent } from './ArtificialAgent';

@ChildEntity()
export class ArtificialAssistant extends ArtificialAgent {}
