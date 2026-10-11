import { Component } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

import { CodeBlock } from '../../shared/code-block';

const INSTALL_SKILL = `cp node_modules/ngx-mat-hijri-adapter/agents/SKILL.md AGENTS.md`;

@Component({
  selector: 'ai-agents',
  imports: [CodeBlock, TranslatePipe],
  templateUrl: './ai-agents.html',
})
export class AiAgents {
  protected readonly installSkill = INSTALL_SKILL;
}
