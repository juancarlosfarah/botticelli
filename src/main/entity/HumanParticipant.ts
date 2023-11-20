import { ChildEntity } from 'typeorm';

import { HumanAgent } from './HumanAgent';

@ChildEntity()
export class HumanParticipant extends HumanAgent {}
