import { ChildEntity } from 'typeorm';

import { ArtificialAgent } from './ArtificialAgent';

@ChildEntity()
export class ArtificialEvaluator extends ArtificialAgent {}
